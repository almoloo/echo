"use server";

import path from "path";
import fs from "fs";
import { openai } from "@/services/openai";
import { echoAssistantInfo, trainingAssistantInfo } from "@/lib/constants";
import { db } from "@/lib/db";
import { getUserAddress } from "@/lib/actions/user";
import { type TextContentBlock } from "openai/resources/beta/threads/messages.mjs";
import { getUser } from "@/lib/data/user";
import { getUserAnswers, getUserSkipped } from "@/lib/data/training";

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

export const createAssistants = async (userData: User) => {
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

export const initializeAssistant = async (
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

export const updateAssistants = async () => {
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
