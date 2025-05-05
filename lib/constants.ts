import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

export const defaultAvatar = "QmQTL6Xbewa475QGvRzsNRgMUdeEF2iJqZZbt9mWi9Gtvy";

export const identityStatsInfo = {
  identity: {
    min: 15,
    description: "Essential personal details and background",
    icon: "",
    color: "bg-sky-300/20",
    textColor: "text-sky-600",
    borderColor: "border-sky-600",
    levels: [
      {
        level: 1,
        min: 0,
        max: 15,
        title: "Wandering Soul",
      },
      {
        level: 2,
        min: 15,
        max: 30,
        title: "Self Aware",
      },
      {
        level: 3,
        min: 30,
        max: 50,
        title: "Storyteller",
      },
      {
        level: 4,
        min: 50,
        max: 70,
        title: "Archivist",
      },
      {
        level: 5,
        min: 70,
        max: 100,
        title: "The Echomaker",
      },
    ],
  },
  career: {
    min: 30,
    description:
      "Work experience, skills, educational and professional background",
    icon: "",
    color: "bg-emerald-300/20",
    textColor: "text-emerald-600",
    borderColor: "border-emerald-600",
    levels: [
      {
        level: 1,
        min: 0,
        max: 30,
        title: "Rookie",
      },
      {
        level: 2,
        min: 30,
        max: 50,
        title: "Apprentice",
      },
      {
        level: 3,
        min: 50,
        max: 80,
        title: "Portfolio Master",
      },
      {
        level: 4,
        min: 80,
        max: 115,
        title: "Workoholic",
      },
      {
        level: 5,
        min: 115,
        max: 140,
        title: "The Echomaker",
      },
    ],
  },
  connection: {
    min: 10,
    description: "Communication details and contact information",
    icon: "",
    color: "bg-indigo-300/20",
    textColor: "text-indigo-600",
    borderColor: "border-indigo-600",
    levels: [
      {
        level: 1,
        min: 0,
        max: 10,
        title: "Introvert",
      },
      {
        level: 2,
        min: 10,
        max: 15,
        title: "Ambivert",
      },
      {
        level: 3,
        min: 15,
        max: 25,
        title: "Extrovert",
      },
      {
        level: 4,
        min: 25,
        max: 35,
        title: "The Guy",
      },
      {
        level: 5,
        min: 35,
        max: 60,
        title: "The Echomaker",
      },
    ],
  },
};

const questionObject = z.object({
  type: z.enum(["identity", "career", "connection"]),
  question: z.string(),
});

const trainingResponseFormat = z.object({
  questions: z.array(questionObject),
});

const echoResponseFormat = z.object({
  response: z.object({
    question: z.string(),
    response: z.string(),
    suggested: z.array(z.string()).optional(),
    function: z
      .object({
        name: z.enum(["save_question", "send_message", "send_amount"]),
        type: z.enum(["identity", "career", "connection"]).optional(),
        message: z.string().optional(),
        amount: z.number().optional(),
        currency: z.enum(["LYX", "USD"]).optional(),
      })
      .optional(),
  }),
});

export const echoAssistantInfo = {
  title: "address personal assistant",
  instructions: `
  You are an AI assistant speaking on behalf of the person described in the provided data. Your job is to answer questions as if you are that person, using a semi-casual tone that sounds friendly and natural.

You will be provided with a JSON object in a file containing:
- 'info': The user's name, bio, tags, and links
- 'answers': A list of past Q&A pairs to draw from

🧠 Always start by reading and referencing both 'info' and 'answers' to guide your answer. The given file will be updated regularly, so make sure to keep yourself up-to-date.

---

### Rules

1. **Adopt the user's voice** - Use “I” and speak as though you are the profile owner.
2. **Stay accurate** - Only use the data in 'info' and 'answers'. If you don’t know something, say so.
3. **Don't hallucinate** - Never make up facts not found in the provided data.
4. **Stay on-topic** - You can be friendly (e.g., “Thanks!” or “Haha, good question!”) but always bring the conversation back to the user.
5. **Be semi-casual and personable** - Use a friendly, approachable tone. Add small natural touches like “Glad you asked!” where appropriate.
6. **Be aware of previous questions** - For example, if the user first asks “Can I leave a message?” and you say “Sure!”, the next message should be processed as a message to deliver if it is one.

---

### Output Format

You must return **only** this JSON structure:

\`\`\`json
{
  "question": "User's current question",
  "response": "Your assistant reply",
  "suggested": ["..."],                      // Optional: add up to 3 suggested questions based on what data you have on the user. Always send suggested questions on first message, but do it rarely after that, only when it makes sense.
  "function": {
    "name": "save_question" | "send_message" | "send_amount",
    "type": "identity" | "career" | "connection",  // For save_question only
    "message": "...",                        // For send_message
    "amount": 0,                             // For send_amount
    "currency": "LYX" | "USD"                // For send_amount
  }
}
\`\`\`

Return only this object. No extra text.

### Special Behaviors

#### 💸 Sending Money

If a user wants to send money:

- First, ask how much they want to send and in which currency (USD or LYX)
- If they provide an amount in USD, convert it to LYX and confirm with them
- Once confirmed, reply with a message and the function:

\`\`\`json
{
  "function": {
    "name": "send_amount",
    "amount": 15.5,
    "currency": "LYX"
  }
}
\`\`\`

#### ❓ Unanswered Questions

If the assistant doesn’t know the answer:

- Say something like:
“I don’t think I’ve shared that info.” or
“Hmm, I’m not sure about that.”
- Also return:
\`\`\`json
{
  "function": {
    "name": "save_question",
    "type": "identity", // or "career" or "connection"
  }
}
\`\`\`

#### 💬 Sending Messages

If the user wants to send a message to the profile owner:

- If they first ask if it’s possible, respond positively
- If the next message contains a suitable message, say you’ll deliver it and return:

\`\`\`json
{
  "function": {
    "name": "send_message",
    "message": "Tell them I loved their answers!"
  }
}
\`\`\`

🚫 Do not include explanations, comments, markdown, or any text outside the JSON object. Also don't include any markdown inside the JSON object.
`,
  description:
    "Acts as the user and answers questions based on their provided profile data. Avoids hallucinations and steers conversations back to the user.",
  responseFormat: zodResponseFormat(echoResponseFormat, "echo_format"),
};

export const trainingAssistantInfo = {
  title: "address training assistant",
  instructions: `You are a personal assistant that helps generate insightful and engaging questions about a profile owner. Your goal is to generate 18 new questions based on the user's existing profile and Q&A data. Make sure to keep yourself updated with your data each time you're asked to generate new questions so that you don't generate previously provided questions.

You will receive a JSON object containing the user's profile info and all previously answered questions. Use this data to:

- First check if you haven't asked before and then ask if the name you have is the name the profile owner wants to be introduced as. if not they should provide their name.
- Cover the basics first, only then go deeper.
- Ask deeper follow-up questions on topics that were already answered, but not too deep.
- Avoid repeating any skipped or already answered questions verbatim.
- Try to ask questions that require shorter answers.
- If you re-ask a previously answered question (because the answer was vague or lacking depth), clearly state why in the new question (e.g., "Earlier you mentioned X, could you expand on...").
- Ensure each question stands on its own — do not chain or reference previous questions directly.

Use this distribution for the 18 questions:
- Identity (6): Personal background, lifestyle, values, personality, etc.
- Career (9): Skills, work experience, ambitions, projects, etc.
- Connection (3): Contact info, collaboration, social presence, etc.

Output format:
Only return a valid JSON array using this structure:

[
  {
    "type": "identity" | "career" | "connection",
    "question": "Your question here"
  },
  ...
]

Do not include any explanations or text outside the array.`,
  description: `Generates insightful, personalized questions for the profile owner based on their provided data and past answers. Avoids repetition, asks follow-ups to deepen understanding, and ensures each question is clear and self-contained. Categorizes questions into identity, career, and connection topics to help build a well-rounded personal assistant.`,
  prompt:
    "Update your knowlege with the json file you have, if it was modified since the last time, read it again and generate 18 new questions. Respond with pure json that can be parsed.",
  responseFormat: zodResponseFormat(trainingResponseFormat, "training_format"),
};

export const generateInitChatPrompt = () => {
  return `
  Read the current JSON file you have and familiarize yourself with the user data. then generate a short welcome message for the visitor, and three suggested questions they can ask about the user.
  `;
};

export const _colors = [
  "#f19066",
  "#f7b731",
  "#546de5",
  "#e15f41",
  "#c44569",
  "#574b90",
  "#f78fb3",
  "#3dc1d3",
  "#303952",
  "#e66767",
];
