"server only";

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

  return {
    infoFile,
    echoAssistant,
    trainingAssistant,
  };
};

const initializeAssistant = async (
  infoFileId: string,
  assistantType: "echo" | "training",
  address: string
) => {
  let assistantInfo;
  let responseFormat: AssistantResponseFormatOption = { type: "text" };

  if (assistantType === "echo") {
    assistantInfo = echoAssistantInfo;
  } else if (assistantType === "training") {
    assistantInfo = trainingAssistantInfo;
    responseFormat = {
      type: "json_object",
    };
  }

  const assistant = await openai.beta.assistants.create({
    name: assistantInfo?.title.replace("address", address),
    description: assistantInfo?.description,
    instructions: assistantInfo?.instructions,
    model: "gpt-4o",
    response_format: responseFormat,
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

export const generateQuestions = async (
  newAnswers?: QuestionAnswer[],
  newSkipped?: string[]
) => {};
