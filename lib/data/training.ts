"use server";

import { getUserAddress } from "@/lib/actions/user";
import { db } from "@/lib/db";
import { encryptId } from "@/lib/server-utils";

export const getUserAnswers = async () => {
  const address = await getUserAddress();
  const answersCollection = db.collection("answers");

  const answers = await answersCollection
    .find({
      address,
    })
    .toArray();

  const encryptedArray = answers.map((elem) => {
    return {
      id: encryptId(elem._id.toString()),
      type: elem.type,
      question: elem.question,
      answer: elem.answer,
    };
  });

  return encryptedArray as unknown as QuestionAnswer[];
};

export const getUserSkipped = async () => {
  const address = await getUserAddress();
  const skippedCollection = db.collection("skipped");

  const skipped = await skippedCollection
    .find({
      address,
    })
    .toArray();

  const encryptedArray = skipped.map((elem) => {
    return {
      id: encryptId(elem._id.toString()),
      type: elem.type,
      question: elem.question,
    };
  });

  return encryptedArray as unknown as Question[];
};
