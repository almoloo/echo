"use server";

import ERC725 from "@erc725/erc725.js";
import profileSchema from "@erc725/erc725.js/schemas/LSP3ProfileMetadata.json";
import { db } from "@/lib/db";
import { getUserAddress } from "@/lib/actions/user";
import { encryptId } from "@/lib/server-utils";
import { UAParser } from "ua-parser-js";

export const getVisitors = async () => {
  const address = await getUserAddress();
  console.log("🎈", address);
  const collection = db.collection("visits");
  const visitors = await collection
    .find({
      contextWallet: address,
    })
    .toArray();

  const encryptedArray = visitors.map((elem) => {
    const userAgentData = UAParser(elem.userAgent);
    const id = encryptId(elem._id.toString());
    const newElem: any = elem;
    delete newElem["_id"];
    return {
      id,
      userAgentData: {
        browser: {
          name: userAgentData.browser.name,
          version: userAgentData.browser.major,
        },
        device: {
          mobile: userAgentData.device.is("mobile"),
          type: userAgentData.device.type,
          vendor: userAgentData.device.vendor,
        },
        os: {
          name: userAgentData.os.name,
          version: userAgentData.os.version,
        },
      },
      ...newElem,
    } as VisitData;
  });

  return encryptedArray;
};
