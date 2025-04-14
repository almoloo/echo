"use server";

import { db } from "@/lib/db";
import { fetchUPMetadata, getUser, getUserData } from "@/lib/data";
import {
  defaultAvatar,
  echoAssistantInfo,
  trainingAssistantInfo,
} from "@/lib/constants";
import { openai } from "@/services/openai";
import fs from "fs";
import path from "path";
import { AssistantResponseFormatOption } from "openai/resources/beta/index.mjs";
import { TextContentBlock } from "openai/resources/beta/threads/messages.mjs";

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

  // const assistant = await initializeAssistant(newUserData, AssistantType.echo);
  const assistants = await createAssistants(newUserData);

  newUserData.infoFileId = assistants.infoFile.id;
  newUserData.assistantId = assistants.echoAssistant.id;
  newUserData.trainingAssistantId = assistants.trainingAssistant.id;
  newUserData.trainingAssistantThreadId = assistants.trainingAssistantThread.id;

  const collection = db.collection("users");
  const res = await collection.insertOne({ ...newUserData });
  return res.insertedId;
};

export const editUser = async (address: string, userInfo: UserInfo) => {
  const collection = db.collection("users");
  const res = await collection.updateOne(
    { address },
    { $set: { info: userInfo } }
  );
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

const updateAssistants = async (address: string) => {
  const userInfo: User | null = await getUser(address);
  const userData = await getUserData(address);

  let mergedData: UserObject = {
    address,
    info: userInfo?.info,
  };

  if (userData) {
    mergedData.questions = userData.questions;
    mergedData.skipped = userData.skipped;
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
};

export const generateQuestions = async (address: string) => {
  const userData = await getUser(address);

  if (!userData) {
    throw new Error("Failed to fetch user data!");
  }

  const { trainingAssistantThreadId, trainingAssistantId } = userData;
  // const assistant = await openai.beta.assistants.retrieve(
  //   userData?.trainingAssistantId
  // );
  // const thread = await openai.beta.threads.retrieve(
  //   userData?.tradingAssistantThreadId
  // );

  console.log("🎈", trainingAssistantThreadId, trainingAssistantId);

  const message = await openai.beta.threads.messages.create(
    trainingAssistantThreadId,
    {
      role: "user",
      content: trainingAssistantInfo.prompt,
    }
  );

  console.log("🎈 message created");

  const run = await openai.beta.threads.runs.createAndPoll(
    trainingAssistantThreadId,
    {
      assistant_id: trainingAssistantId,
    }
  );

  console.log("🎈 run created");

  if (run.status === "completed") {
    console.log("🎈 completed");
    const messages = await openai.beta.threads.messages.list(run.thread_id);
    const latestMessage = messages.data[0].content[0] as TextContentBlock;
    console.log("🎈 message: ", latestMessage.text.value);
    return latestMessage.text.value;
  }
};
