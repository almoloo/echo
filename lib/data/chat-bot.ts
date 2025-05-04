"use server";

import { getUserAddress } from "@/lib/actions/user";
import { db } from "@/lib/db";
import { encryptId } from "@/lib/server-utils";

export const fetchDeliveredMessages = async () => {
  const address = await getUserAddress();
  const collection = db.collection("delivered");

  const deliveredMessages = await collection.find({ to: address }).toArray();

  const encryptedArray = deliveredMessages.map((message) => {
    const newObj: any = message;
    const encryptedId = encryptId(message._id.toString());
    delete newObj["_id"];
    newObj.id = encryptedId;
    return newObj as DeliveredMessage;
  });

  return encryptedArray;
};
