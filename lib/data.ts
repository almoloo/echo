"server only";

import { db } from "@/lib/db";
import { ERC725 } from "@erc725/erc725.js";
import profileSchema from "@erc725/erc725.js/schemas/LSP3ProfileMetadata.json";

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
