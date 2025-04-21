"use server";

import { openai } from "@/services/openai";
import { generateInitChatPrompt } from "../constants";
import { TextContentBlock } from "openai/resources/beta/threads/messages.mjs";

export const createChatSession = async (assistantId: string, name?: string) => {
  if (!assistantId) throw new Error("Assistant ID is required!");

  const thread = await openai.beta.threads.create();

  const welcomeMessage = await openai.beta.threads.messages.create(thread.id, {
    role: "assistant",
    content: generateInitChatPrompt(),
  });

  let run = await openai.beta.threads.runs.createAndPoll(thread.id, {
    assistant_id: assistantId,
  });

  if (run.status === "completed") {
    const messages = await openai.beta.threads.messages.list(run.thread_id);
    const latestMessage = messages.data[0];
    const latestMessageText = latestMessage.content[0] as TextContentBlock;
    console.log(`${latestMessage.role} > ${latestMessageText.text.value}`);
    return {
      threadId: thread.id,
      message: latestMessageText.text.value,
    };
  } else {
    throw new Error("Failed to create chat session!");
  }
};
