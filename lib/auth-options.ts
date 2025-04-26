import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import UniversalProfileContract from "@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json";
import { getAddress, getContract, createPublicClient, http } from "viem";
import { lukso } from "viem/chains";
import { createUser } from "@/lib/actions/user";
import { getUser } from "@/lib/data/user";

const LuksoClient = createPublicClient({
  chain: lukso,
  transport: http(),
});

export const authOptions: NextAuthOptions = {
  debug: true,
  providers: [
    CredentialsProvider({
      id: "lukso-up",
      name: "Lukso Universal Profile",
      credentials: {
        message: { label: "Message", type: "text" },
        signature: { label: "Signature", type: "text" },
        address: { label: "Address", type: "text" },
      },
      async authorize(credentials) {
        if (
          !credentials?.message ||
          !credentials.signature ||
          !credentials.address
        ) {
          console.error("Missing required credentials");
          return null;
        }

        try {
          const contract = getContract({
            abi: UniversalProfileContract.abi,
            address: getAddress(credentials.address || "0x"),
            client: LuksoClient,
          });

          const isValidSignature = await contract.read.isValidSignature([
            credentials.message,
            credentials.signature,
          ]);

          if (isValidSignature !== "0x1626ba7e") {
            console.error("Address mismatch");
            return null;
          }

          // CHECK IF USER EXISTS IN DATABASE
          const user = await getUser(credentials.address);
          let userID: string;
          let avatar: string;
          let name: string;
          if (user) {
            // FETCH ID
            userID = user._id.toString();
            avatar = user.info.avatar;
            name = user.info.name;
          } else {
            // CREATE USER
            const newUser = await createUser(credentials.address);
            userID = newUser.id.toString();
            avatar = newUser.avatar!;
            name = newUser.name!;
          }
          return {
            id: userID,
            address: credentials.address,
            image: avatar,
            name,
          };
        } catch (error) {
          console.error("Verification Error: ", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.address = user.address;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.address = token.address as string;
      }
      return session;
    },
  },
};
