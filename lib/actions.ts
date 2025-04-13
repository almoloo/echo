"server only";

import { db } from "@/lib/db";
import { fetchUPMetadata } from "@/lib/data";
import { createAssistantPrompt, defaultAvatar } from "@/lib/constants";
import { openai } from "@/services/openai";
import fs from "fs";
import path from "path";

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

  const assistant = await initializeAssistant(newUserData);

  newUserData.infoFileId = assistant.infoFile.id;
  newUserData.assistantId = assistant.assistant.id;

  const collection = db.collection("users");
  const res = await collection.insertOne({ ...newUserData });
  return res.insertedId;
};

export const editUser = async (address: string, userInfo: UserInfo) => {
  const collection = db.collection("users");
  const filter = { address };
  const res = await collection.updateOne(filter, { $set: { info: userInfo } });
};

// ---------- AI ACTIONS

export const initializeAssistant = async (userData: User) => {
  const filePath = path.join(
    process.cwd(),
    `public/${userData.address}-data.json`
  );
  fs.writeFileSync(filePath, JSON.stringify(userData, null, 2));
  const readStream = fs.createReadStream(filePath);

  const infoFile = await openai.files.create({
    file: readStream,
    purpose: "assistants",
  });

  const assistant = await openai.beta.assistants.create({
    name: `${userData.address} personal assistant`,
    description:
      "Acts as the user and answers questions based on their provided profile data. Avoids hallucinations and steers conversations back to the user.",
    instructions: createAssistantPrompt(),
    model: "gpt-4o",
    tools: [{ type: "code_interpreter" }],
    tool_resources: {
      code_interpreter: {
        file_ids: [infoFile.id],
      },
    },
  });

  return {
    assistant,
    infoFile,
  };
};

export const generateQuestions = async (
  newAnswers?: QuestionAnswer[],
  newSkipped?: string[]
) => {};
