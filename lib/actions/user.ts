"use server";

import { defaultAvatar } from "@/lib/constants";
import { fetchUPMetadata } from "@/lib/data/user";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { createAssistants } from "@/lib/actions/ai";

export const getUserAddress = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("You need to be signed in!");
  return session.user.address.toLowerCase();
};

export const createUser = async (address: string) => {
  if (!address || address === "") {
    throw new Error("Wallet address is required!");
  }

  let newUserData: User = {
    address: address.toLowerCase(),
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
  return { id: res.insertedId, avatar: newUserData.info?.avatar };
};

export const editUser = async (userInfo: UserInfo) => {
  const address = await getUserAddress();
  const collection = db.collection("users");
  await collection.updateOne({ address }, { $set: { info: userInfo } });
};
