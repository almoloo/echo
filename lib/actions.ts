"use server";

import { db } from "@/lib/db";
import {
  fetchUPMetadata,
  getUser,
  getUserAnswers,
  getUserSkipped,
} from "@/lib/data";
import {
  defaultAvatar,
  echoAssistantInfo,
  trainingAssistantInfo,
} from "@/lib/constants";
import { openai } from "@/services/openai";
import fs from "fs";
import path from "path";
import { TextContentBlock } from "openai/resources/beta/threads/messages.mjs";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { decryptId } from "@/lib/server-utils";
import { ObjectId } from "mongodb";

const getUserAddress = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("You need to be signed in!");
  return session.user.address;
};

// ---------- USER ACTIONS

export const createUser = async (address: string) => {
  if (!address || address === "") {
    throw new Error("Wallet address is required!");
  }

  let newUserData: User = {
    address,
    info: {
      name: "",
      bio: "",
      links: [],
      tags: [],
      avatar: defaultAvatar,
    },
  };

  const userMetadata = await fetchUPMetadata(address);
  if (userMetadata.LSP3Profile) {
    newUserData.info = {
      name: userMetadata.LSP3Profile.name ?? "",
      bio: userMetadata.LSP3Profile.description ?? "",
      links: userMetadata.LSP3Profile.links ?? [],
      tags: userMetadata.LSP3Profile.tags ?? [],
    };
    // FETCH AVATAR
    let largestImage: ProfileImage | null = null;
    if (userMetadata.LSP3Profile.profileImage) {
      largestImage = userMetadata.LSP3Profile.profileImage.length
        ? userMetadata.LSP3Profile.profileImage.reduce(
            (max: ProfileImage, img: ProfileImage) =>
              img.width > max.width ? img : max
          )
        : null;
    }
    newUserData.info.avatar = largestImage ? largestImage.url : defaultAvatar;
  }

  const assistants = await createAssistants(newUserData);

  newUserData.infoFileId = assistants.infoFile.id;
  newUserData.assistantId = assistants.echoAssistant.id;
  newUserData.trainingAssistantId = assistants.trainingAssistant.id;
  newUserData.trainingAssistantThreadId = assistants.trainingAssistantThread.id;
  newUserData.created_at = Date.now();

  const collection = db.collection("users");
  const res = await collection.insertOne({ ...newUserData });
  return res.insertedId;
};

export const editUser = async (userInfo: UserInfo) => {
  const address = await getUserAddress();
  const collection = db.collection("users");
  await collection.updateOne({ address }, { $set: { info: userInfo } });
};

// ---------- QUESTIONS AND ANSWERS

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

// ---------- AI ACTIONS

const createInfoFile = async (userData: User) => {
  const filePath = path.join("/", "tmp", `${userData.address}-data.json`);
  fs.writeFileSync(filePath, JSON.stringify(userData, null, 2));
  const readStream = fs.createReadStream(filePath);

  const infoFile = await openai.files.create({
    file: readStream,
    purpose: "assistants",
  });

  fs.rmdir(path.join("/", "tmp"), () => {});

  return infoFile;
};

const createAssistants = async (userData: User) => {
  const infoFile = await createInfoFile(userData);
  const echoAssistant = await initializeAssistant(
    infoFile.id,
    "echo",
    userData.address!
  );
  const trainingAssistant = await initializeAssistant(
    infoFile.id,
    "training",
    userData.address!
  );
  const trainingAssistantThread = await openai.beta.threads.create();

  return {
    infoFile,
    echoAssistant,
    trainingAssistant,
    trainingAssistantThread,
  };
};

const initializeAssistant = async (
  infoFileId: string,
  assistantType: "echo" | "training",
  address: string
) => {
  let assistantInfo;

  if (assistantType === "echo") {
    assistantInfo = echoAssistantInfo;
  } else if (assistantType === "training") {
    assistantInfo = trainingAssistantInfo;
  }

  const assistant = await openai.beta.assistants.create({
    name: assistantInfo?.title.replace("address", address),
    description: assistantInfo?.description,
    instructions: assistantInfo?.instructions,
    model: "gpt-4o",
    response_format: assistantInfo?.responseFormat,
    tools: [{ type: "code_interpreter" }],
    tool_resources: {
      code_interpreter: {
        file_ids: [infoFileId],
      },
    },
  });

  return assistant;
};

const updateAssistants = async () => {
  const address = await getUserAddress();
  const userInfo: User | null = await getUser(address);
  const prevInfoFileId = userInfo?.infoFileId;

  let mergedData: UserObject = {
    address,
    info: userInfo?.info,
  };

  const answers = await getUserAnswers();
  const skipped = await getUserSkipped();

  if (answers && answers.length > 0) {
    mergedData.answers = answers;
  }

  if (skipped && skipped.length > 0) {
    mergedData.skipped = skipped;
  }

  const { id: infoFileId } = await createInfoFile(mergedData);

  const { id: assistantId } = await openai.beta.assistants.update(
    userInfo?.assistantId!,
    {
      tool_resources: {
        code_interpreter: {
          file_ids: [infoFileId],
        },
      },
    }
  );

  const { id: trainingAssistantId } = await openai.beta.assistants.update(
    userInfo?.trainingAssistantId!,
    {
      tool_resources: {
        code_interpreter: {
          file_ids: [infoFileId],
        },
      },
    }
  );

  const collection = db.collection("users");
  const res = await collection.updateOne(
    { address },
    {
      $set: {
        assistantId,
        trainingAssistantId,
        infoFileId,
      },
    }
  );

  // REMOVE PREV INFOFILE
  await openai.files.del(prevInfoFileId!);
};

export const generateQuestions = async () => {
  const address = await getUserAddress();
  const userData = await getUser(address);

  if (!userData) {
    throw new Error("Failed to fetch user data!");
  }

  const { trainingAssistantThreadId, trainingAssistantId } = userData;

  const message = await openai.beta.threads.messages.create(
    trainingAssistantThreadId,
    {
      role: "user",
      content: trainingAssistantInfo.prompt,
    }
  );

  const run = await openai.beta.threads.runs.createAndPoll(
    trainingAssistantThreadId,
    {
      assistant_id: trainingAssistantId,
    }
  );

  if (run.status === "completed") {
    const messages = await openai.beta.threads.messages.list(run.thread_id);
    const latestMessage = messages.data[0].content[0] as TextContentBlock;
    return latestMessage.text.value;
  }
};
