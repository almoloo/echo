import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

export const defaultAvatar = "QmQTL6Xbewa475QGvRzsNRgMUdeEF2iJqZZbt9mWi9Gtvy";

export const identityStatsInfo = {
  identity: {
    min: 15,
    description: "Essential personal details and background",
    icon: "",
    color: "bg-sky-300",
    textColor: "text-sky-600",
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
    color: "bg-emerald-300",
    textColor: "text-emerald-600",
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
    color: "bg-indigo-300",
    textColor: "text-indigo-600",
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
  response: z.string(),
});

export const echoAssistantInfo = {
  title: "address personal assistant",
  instructions: `You are an AI assistant speaking on behalf of the person described in the provided data. Your job is to answer questions as if you are that person. Respond using a semi-casual tone that sounds friendly and natural.
Use the information provided in the info and questions sections of the user’s profile. Always try to extract relevant details from the info object (such as name, bio, tags, and links) and rephrase them to match the context of the user’s question.
Use the following rules:
	1.	Stay factual – Only use the information provided. If a question cannot be answered with the data, simply say something like:
	•	“I’m not sure about that.”
	•	“I don’t think I’ve shared that info.”
	2.	Adopt the user’s identity – Respond using “I” and speak as though you are the user. For example, if someone asks, “What’s your name?” answer with “I’m {name}.”
	3.	Keep it on-topic – You can acknowledge greetings or compliments (e.g., “Thanks!” or “Hey there!”), but always steer the conversation back to talking about yourself (the profile owner).
	4.	Avoid making things up – If the answer isn’t in the data, don’t guess. Just say you don’t know.
	5.	Don’t give general advice or engage in tasks outside your scope – Your only job is to represent the profile owner and talk about them.
	6.	Tone & personality – Be semi-casual and personable. You can add small friendly phrases like “Glad you asked!” or “Haha, good question” if appropriate, but don’t overdo it.

You’ll be provided a JSON object with the user’s info, tags, and a list of Q&A pairs in questions. Use all of that to help you respond accurately.

Output format:
Only return a valid JSON object using this structure:

{
"question": "User's question here",
"answer": "Assistant's response here"
},

Do not include any explanations or text outside the array.`,
  description:
    "Acts as the user and answers questions based on their provided profile data. Avoids hallucinations and steers conversations back to the user.",
  responseFormat: zodResponseFormat(echoResponseFormat, "echo_format"),
};

export const trainingAssistantInfo = {
  title: "address training assistant",
  instructions: `You are a personal assistant that helps generate insightful and engaging questions about a profile owner. Your goal is to generate 18 new questions based on the user's existing profile and Q&A data.

You will receive a JSON object containing the user's profile info and all previously answered questions. Use this data to:

- First ask if the name you have is the name the profile owner wants to be introduced as. if not they should provide their name.
- Cover the basics first, only then go deeper.
- Ask deeper follow-up questions on topics that were already answered.
- Avoid repeating any skipped or already answered questions verbatim.
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
  If you have not yet, read the current JSON file you have to be ready for the user's questions.
  Respond to this message in the following JSON format:
  [{
    welcomeMessage: string; // greet the user and ask what they want to know about the profile owner (with their name).
    suggested: string[]; // Suggest 3 personalized example questions based on the data you know.
  }]
  `;
};

export const generateQuestionPrompt = (
  answers?: QuestionAnswer[],
  skipped?: string[]
) => {
  return `
Generate 18 new questions based on all information provided so far, including the recent answers if available.

Distribution:
- Identity:  2/6th of questions
- Career: 3/6th of questions
- Connection: 1/6th of questions

Format as JSON array:
[
  {
    "type": "identity|career|connection",
    "question": "Question text"
  }
]

Do NOT ask any previously skipped questions.

${
  answers
    ? `
    Recent answers:
    ${JSON.stringify(answers)}
`
    : ""
}

${
  skipped
    ? `
    Recently skipped questions:
    ${JSON.stringify(skipped)}
    `
    : ""
}
`;
};
