"use server";

import ERC725 from "@erc725/erc725.js";
import profileSchema from "@erc725/erc725.js/schemas/LSP3ProfileMetadata.json";
import { db } from "@/lib/db";
import { getUserAddress } from "@/lib/actions/user";

export const getVisitors = async () => {
  const address = await getUserAddress();
  const collection = db.collection("visits");
  const visits = collection.find({});
};
