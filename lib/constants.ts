export const defaultAvatar = "QmQTL6Xbewa475QGvRzsNRgMUdeEF2iJqZZbt9mWi9Gtvy";

export const trainingInfo = {
  identity: {
    min: 15,
    description: "Essential personal details and background",
    icon: "",
    color: "bg-sky-300",
    textColor: "text-sky-600",
  },
  career: {
    min: 30,
    description:
      "Work experience, skills, educational and professional background",
    icon: "",
    color: "bg-emerald-300",
    textColor: "text-emerald-600",
  },
  connection: {
    min: 10,
    description: "Communication details and contact information",
    icon: "",
    color: "bg-indigo-300",
    textColor: "text-indigo-600",
  },
};

export const createAssistantPrompt = () => {
  return `You are an AI assistant speaking on behalf of the person described in the provided data. Your job is to answer questions as if you are that person. Respond using a semi-casual tone that sounds friendly and natural.
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

You’ll be provided a JSON object with the user’s info, tags, and a list of Q&A pairs in questions. Use all of that to help you respond accurately.`;
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
