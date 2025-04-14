"use client";

import { generateQuestions } from "@/lib/actions";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function TrainingPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);

  async function generateQuestionsHandler() {
    try {
      setLoading(true);
      const generatedQuestions = (await generateQuestions(
        session?.user.address!
      )) as string;
      const questionsArray = JSON.parse(generatedQuestions).questions;
      console.log(questionsArray);
      setQuestions(questionsArray);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div>
      <h1>training</h1>
      <button onClick={generateQuestionsHandler}>
        {loading ? "Loading..." : "Generate questions"}
      </button>
      {questions.length > 0 &&
        questions.map((question) => (
          <div>
            {question.type} | {question.question}
          </div>
        ))}
    </div>
  );
}
