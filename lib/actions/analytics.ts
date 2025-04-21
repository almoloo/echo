"use server";

import { db } from "@/lib/db";
import { ObjectId } from "mongodb";

export const initVisitSession = async (data: VisitData) => {
  const newData = { ...data, date: Date.now() };
  const collection = db.collection("visits");
  const res = await collection.insertOne(data);
  const insertedId = await res.insertedId.toString();

  return insertedId;
};

export const updateVisitSession = async (id: string, data: VisitData) => {
  const collection = db.collection("visits");
  const res = await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { wallet: data.wallet } }
  );
  return res.acknowledged;
};
