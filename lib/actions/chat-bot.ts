"use server";

import { openai } from "@/services/openai";
import { generateInitChatPrompt } from "../constants";
import { TextContentBlock } from "openai/resources/beta/threads/messages.mjs";
import { db } from "@/lib/db";

export const createChatSession = async (assistantId: string) => {
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
    return {
      threadId: thread.id,
      message: latestMessageText.text.value,
    };
  } else {
    throw new Error("Failed to create chat session!");
  }
};

export const askQuestionFromAssistant = async (
  question: string,
  assistantId: string,
  threadId: string
) => {
  const msg = await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: question,
  });

  const run = await openai.beta.threads.runs.createAndPoll(threadId, {
    assistant_id: assistantId,
  });

  if (run.status === "completed") {
    const messages = await openai.beta.threads.messages.list(run.thread_id);
    const messageBlock = messages.data[0].content[0] as TextContentBlock;
    return messageBlock.text.value;
  }
};

export const saveQuestionForLater = async (
  from: string,
  to: string,
  question: Question
) => {
  if (!from || !to || !question)
    throw new Error("All the parameters are required!");

  const collection = db.collection("questions");
  const res = await collection.insertOne({
    created_at: Date.now(),
    from,
    to,
    question,
  });

  return res.acknowledged;
};

export const deliverMessage = async (message: DeliveredMessage) => {
  const collection = db.collection("messages");
  const res = await collection.insertOne({
    created_at: Date.now(),
    from: message.from,
    to: message.to,
    text: message.text,
    read: false,
  });

  return res.acknowledged;
};
