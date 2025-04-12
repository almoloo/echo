"server only";

import { db } from "@/lib/db";
import { fetchUPMetadata } from "@/lib/data";
import { defaultAvatar } from "@/lib/constants";

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

  const collection = db.collection("users");
  const res = await collection.insertOne({ ...newUserData });
  return res.insertedId;
};

export const editUser = async (address: string, userInfo: UserInfo) => {
  const collection = db.collection("users");
  const filter = { address };
  const res = await collection.updateOne(filter, { $set: { info: userInfo } });
};
