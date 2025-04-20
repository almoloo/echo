"use server";

import { getUserAddress } from "@/lib/actions/user";
import { db } from "@/lib/db";
import { decryptId } from "@/lib/server-utils";
import { ObjectId } from "mongodb";
import { updateAssistants } from "@/lib/actions/ai";

export const saveAnswers = async (
  answers: QuestionAnswer[],
  skipped: Question[]
) => {
  const address = await getUserAddress();
  const modifiedAnswers = answers.map((answer) => ({ address, ...answer }));
  const modifiedSkipped = skipped.map((skippedItem) => ({
    address,
    ...skippedItem,
  }));

  const answersCollection = db.collection("answers");
  const skippedCollection = db.collection("skipped");

  await answersCollection.insertMany(modifiedAnswers);
  await skippedCollection.insertMany(modifiedSkipped);

  await updateAssistants();
};

export const modifyAnswer = async (id: string, newAnswer: string) => {
  const decryptedId = decryptId(id);
  const collection = db.collection("answers");
  const res = await collection.updateOne(
    { _id: new ObjectId(decryptedId) },
    {
      $set: { answer: newAnswer },
    }
  );
  await updateAssistants();
  return res.acknowledged;
};

export const removeAnswer = async (id: string) => {
  const decryptedId = decryptId(id);
  const collection = db.collection("answers");
  const res = await collection.deleteOne({ _id: new ObjectId(decryptedId) });
  await updateAssistants();
  return res.acknowledged;
};

export const markAnswerAsSkipped = async (id: string) => {
  const decryptedId = decryptId(id);
  const answersCollection = db.collection("answers");
  const delRes = await answersCollection.findOneAndDelete({
    _id: new ObjectId(decryptedId),
  });
  const question = delRes as unknown as Question;

  const skippedcollection = db.collection("skipped");
  const res = await skippedcollection.insertOne({
    type: question.type,
    question: question.question,
    address: question.address,
  });

  await updateAssistants();
  return res.acknowledged;
};

export const removeSkipped = async (id: string) => {
  const decryptedId = decryptId(id);
  const collection = db.collection("skipped");
  const res = await collection.deleteOne({ _id: new ObjectId(decryptedId) });
  await updateAssistants();
  return res.acknowledged;
};

export const answerSkipped = async (id: string, answer: string) => {
  const decryptedId = decryptId(id);
  const skippedCollection = db.collection("skipped");
  const delRes = await skippedCollection.findOneAndDelete({
    _id: new ObjectId(decryptedId),
  });
  const question = delRes as unknown as Question;

  const answersCollection = db.collection("answers");
  const res = await answersCollection.insertOne({
    type: question.type,
    question: question.question,
    answer: answer,
    address: question.address,
  });

  await updateAssistants();
  return res.acknowledged;
};
