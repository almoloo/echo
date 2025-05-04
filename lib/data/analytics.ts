"use server";

import { db } from "@/lib/db";
import { getUserAddress } from "@/lib/actions/user";
import { encryptId } from "@/lib/server-utils";
import { UAParser } from "ua-parser-js";
import { hideIp } from "../utils";

export const getVisitors = async () => {
  const address = await getUserAddress();
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
      ...newElem,
      id,
      location: {
        ...newElem.location,
        ip: hideIp(newElem.location.ip),
      },
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
    } as VisitData;
  });

  return encryptedArray;
};
