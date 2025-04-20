"use client";

import CharacterCard from "@/components/training/character-card";
import QuestionCard from "@/components/training/question-card";
import { saveAnswers } from "@/lib/actions/training";
import { generateQuestions } from "@/lib/actions/ai";
import { getCharacterStats } from "@/lib/data/user";
import { useEffect, useState } from "react";

const defaultQuestions = [
  {
    type: "identity",
    question:
      "How do you unwind after a long day of coding and development work?",
  },
  {
    type: "identity",
    question: "What inspired you to pursue a career in frontend development?",
  },
  {
    type: "identity",
    question:
      "Can you share more about your background and how it has influenced your career choices?",
  },
  {
    type: "identity",
    question:
      "You seem to have a passion for technology. How did this interest begin?",
  },
  {
    type: "identity",
    question:
      "What are some values you find most important in your personal life?",
  },
  {
    type: "identity",
    question:
      "Could you describe a personal or professional milestone that you are particularly proud of?",
  },
  {
    type: "career",
    question:
      "In your role as a frontend developer, what challenges do you encounter most often?",
  },
  {
    type: "career",
    question:
      "Do you have a mentor or role model in the tech industry who has impacted your career?",
  },
  {
    type: "career",
    question:
      "What is your approach to integrating new technologies into your work?",
  },
  {
    type: "career",
    question:
      "Could you discuss a project where you had to overcome significant technical hurdles?",
  },
  {
    type: "career",
    question:
      "With your interest in Web3, how do you see the future of decentralized technologies?",
  },
  {
    type: "career",
    question:
      "What steps are you taking to advance your skills in Javascript and Web3 technologies?",
  },
  {
    type: "career",
    question: "How do you measure success in your projects or career?",
  },
  {
    type: "career",
    question:
      "Have you attended or are planning to attend any conferences or meetups related to your industry?",
  },
  {
    type: "career",
    question:
      "How do you stay motivated and focused in your professional development journey?",
  },
  {
    type: "connection",
    question: "How do you approach building a community or following online?",
  },
  {
    type: "connection",
    question:
      "What platforms do you find most effective for professional networking?",
  },
  {
    type: "connection",
    question:
      "Are there any particular social media strategies you use to promote your work or personal brand?",
  },
];

export default function TrainingPage() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [questions, setQuestions] = useState<Question[]>(
    defaultQuestions as Question[]
  );
  const [answers, setAnswers] = useState<QuestionAnswer[]>([]);
  const [skipped, setSkipped] = useState<Question[]>([]);
  const [character, setCharacter] = useState<CharacterInfo | null>(null);
  const [characterLoading, setCharacterLoading] = useState(false);

  async function updateCharacter() {
    const charInfo = await getCharacterStats();
    setCharacter(charInfo);
  }

  useEffect(() => {
    updateCharacter();
  }, []);

  function nextQuestion(currentQuestion: Question) {
    setQuestions((prev) =>
      prev.filter(
        (questionItem) => questionItem.question !== currentQuestion.question
      )
    );
  }

  function submitAnswer(answer: QuestionAnswer) {
    console.log(answer);
    setAnswers((prev) => [answer, ...prev]);
    nextQuestion(answer);
  }

  function skipQuestion(question: Question) {
    setSkipped((prev) => [question, ...prev]);
    nextQuestion(question);
  }

  async function generateQuestionsHandler() {
    try {
      setLoading(true);
      const generatedQuestions = (await generateQuestions()) as string;
      const questionsArray = JSON.parse(generatedQuestions).questions;
      console.log(questionsArray);
      setQuestions(questionsArray);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function updateAnswers() {
    const submittedAnswers = await saveAnswers(answers, skipped);
  }

  return (
    <div>
      <CharacterCard character={character} loading={characterLoading} />
      <h1>training</h1>
      <button onClick={generateQuestionsHandler}>
        {loading ? "Loading..." : "Generate questions"}
      </button>
      {questions.length > 0 && (
        <div>
          <QuestionCard
            question={questions[0]}
            skipQuestion={skipQuestion}
            submitAnswer={submitAnswer}
          />
        </div>
      )}
      <div>
        <p>----------</p>
        <button onClick={updateAnswers}>SUBMIT ANSWERS</button>
        <p>----------</p>
      </div>
      <div>
        {answers.length > 0 && (
          <div>
            <h1>answers: </h1>
            {answers.map((answerElem) => (
              <div>
                {answerElem.type}:<p>{answerElem.question}</p>
                <p>{answerElem.answer}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        {skipped.length > 0 && (
          <div>
            <h1>skipped: </h1>
            {skipped.map((skipElem) => (
              <div>
                {skipElem.type}:<p>{skipElem.question}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
