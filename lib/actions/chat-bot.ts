"use server";

import { openai } from "@/services/openai";
import { generateInitChatPrompt } from "../constants";
import { TextContentBlock } from "openai/resources/beta/threads/messages.mjs";

export const createChatSession = async (assistantId: string, name?: string) => {
  console.log("🎈 here 7");
  if (!assistantId) throw new Error("Assistant ID is required!");

  const thread = await openai.beta.threads.create();
  console.log("🎈 here 8");

  const welcomeMessage = await openai.beta.threads.messages.create(thread.id, {
    role: "assistant",
    content: generateInitChatPrompt(),
  });
  console.log("🎈 here 9");

  let run = await openai.beta.threads.runs.createAndPoll(thread.id, {
    assistant_id: assistantId,
  });
  console.log("🎈 here 10");

  if (run.status === "completed") {
    console.log("🎈 here 11");
    const messages = await openai.beta.threads.messages.list(run.thread_id);
    console.log("🎈 here 12");
    const latestMessage = messages.data[0];
    const latestMessageText = latestMessage.content[0] as TextContentBlock;
    console.log(`${latestMessage.role} > ${latestMessageText.text.value}`);
    return {
      threadId: thread.id,
      message: latestMessageText.text.value,
    };
  } else {
    console.log("🎈 here 13");
    throw new Error("Failed to create chat session!");
  }
};
