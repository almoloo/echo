"server only";

import { db } from "@/lib/db";
import { ERC725 } from "@erc725/erc725.js";
import profileSchema from "@erc725/erc725.js/schemas/LSP3ProfileMetadata.json";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";

const getUserAddress = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("You need to be signed in!");
  return session.user.address;
};

// ---------- USER DATA

export const fetchUPMetadata = async (address: string) => {
  const erc725js = new ERC725(
    profileSchema,
    address,
    "https://rpc.mainnet.lukso.network",
    {
      ipfsGateway: "https://api.universalprofile.cloud/ipfs/",
    }
  );
  const decodedProfileMetadata = await erc725js.fetchData("LSP3Profile");
  return decodedProfileMetadata.value as {
    LSP3Profile: Record<string, any>;
  };
};

export const getUser = async (address: string) => {
  if (!address || address === "") {
    throw new Error("Wallet address is required!");
  }

  const collection = db.collection("users");
  const user = await collection.findOne({
    address,
  });

  return user;
};

export const getUserAnswers = async () => {
  const address = await getUserAddress();
  const answersCollection = db.collection("answers");

  const answers = await answersCollection.find({
    address,
  });

  return answers.toArray() as unknown as QuestionAnswer[];
};

export const getUserSkipped = async () => {
  const address = await getUserAddress();
  const skippedCollection = db.collection("skipped");

  const skipped = await skippedCollection.find({
    address,
  });

  return skipped.toArray() as unknown as Question[];
};
