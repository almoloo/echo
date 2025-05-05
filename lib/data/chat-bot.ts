"use server";

import { getUserAddress } from "@/lib/actions/user";
import { db } from "@/lib/db";
import { encryptId } from "@/lib/server-utils";

export const fetchUnreadMessages = async () => {
  const address = await getUserAddress();
  const collection = db.collection("messages");

  const unreadMessages = await collection
    .find({ to: address, read: false })
    .toArray();

  return unreadMessages.length;
};

export const fetchDeliveredMessages = async () => {
  const address = await getUserAddress();
  const collection = db.collection("messages");

  const deliveredMessages = await collection.find({ to: address }).toArray();

  const encryptedArray = deliveredMessages.map((message) => {
    const newObj: any = message;
    const encryptedId = encryptId(message._id.toString());
    delete newObj["_id"];
    newObj.id = encryptedId;
    return newObj as DeliveredMessage;
  });

  await collection.updateMany(
    { to: address },
    {
      $set: {
        read: true,
      },
    }
  );

  return encryptedArray;
};

export const fetchUnreadAskedQuestions = async () => {
  const address = await getUserAddress();
  const collection = db.collection("questions");

  const askedQuestions = await collection
    .find({ address, read: false })
    .toArray();

  return askedQuestions.length;
};

export const fetchAskedQuestions = async () => {
  const address = await getUserAddress();
  const collection = db.collection("questions");

  const askedQuestions = await collection.find({ address }).toArray();

  const encryptedArray = askedQuestions.map((question) => {
    const newObj: any = question;
    const encryptedId = encryptId(question._id.toString());
    delete newObj["_id"];
    newObj.id = encryptedId;
    return newObj as AskedQuestion;
  });

  await collection.updateMany(
    { address },
    {
      $set: {
        read: true,
      },
    }
  );

  return encryptedArray;
};
