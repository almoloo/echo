"use server";

import ERC725 from "@erc725/erc725.js";
import profileSchema from "@erc725/erc725.js/schemas/LSP3ProfileMetadata.json";
import { db } from "@/lib/db";
import { getUserAnswers } from "@/lib/data/training";
import { identityStatsInfo } from "@/lib/constants";

export const fetchUPMetadata = async (address: string) => {
  const erc725js = new ERC725(
    profileSchema,
    address.toLowerCase(),
    "https://rpc.mainnet.lukso.network",
    {
      ipfsGateway: "https://api.universalprofile.cloud/ipfs/",
    }
  );
  const decodedProfileMetadata = await erc725js.fetchData("LSP3Profile");
  return decodedProfileMetadata.value as {
    LSP3Profile: Record<string, any>;
  };
};

export const getUser = async (address: string) => {
  if (!address || address === "") {
    throw new Error("Wallet address is required!");
  }

  const collection = db.collection("users");
  const user = await collection.findOne({
    address: address.toLowerCase(),
  });

  return user;
};

export const getCharacterStats = async () => {
  const answers = await getUserAnswers();
  const calcPercent = (a: number, b: number) => (a / b) * 100;

  const getCurrentLevel = (
    a: number,
    levels: { min: number; max: number; title: string }[]
  ) => {
    let currentLevel;
    levels.forEach((level) => {
      if (a > level.min && a <= level.max) currentLevel = level;
    });
    return currentLevel ?? levels.filter((level) => level.min === 0)[0];
  };

  const identityAnswers = answers.filter(
    (answer) => answer.type === "identity"
  );
  const careerAnswers = answers.filter((answer) => answer.type === "career");
  const connectionAnswers = answers.filter(
    (answer) => answer.type === "connection"
  );

  const identityLevel = getCurrentLevel(
    identityAnswers.length,
    identityStatsInfo.identity.levels
  );
  const careerLevel = getCurrentLevel(
    careerAnswers.length,
    identityStatsInfo.career.levels
  );
  const connectionLevel = getCurrentLevel(
    connectionAnswers.length,
    identityStatsInfo.connection.levels
  );

  const identityPercent = calcPercent(
    identityAnswers.length,
    identityLevel.max
  );
  const careerPercent = calcPercent(careerAnswers.length, careerLevel.max);
  const connectionPercent = calcPercent(
    connectionAnswers.length,
    connectionLevel.max
  );

  return {
    identity: {
      percentage: identityPercent,
      level: identityLevel,
    },
    career: {
      percentage: careerPercent,
      level: careerLevel,
    },
    connection: {
      percentage: connectionPercent,
      level: connectionLevel,
    },
  } as CharacterInfo;
};
