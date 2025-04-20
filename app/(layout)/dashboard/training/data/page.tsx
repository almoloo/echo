"use client";

import AnswerCard from "@/components/training/answer-card";
import SkippedCard from "@/components/training/skipped-card";
import { getUserAnswers, getUserSkipped } from "@/lib/data/training";
import { useEffect, useState } from "react";

export default function AvailableDataPage() {
  const [answers, setAnswers] = useState<QuestionAnswer[]>([]);
  const [skipped, setSkipped] = useState<Question[]>([]);
  const [loadingAnswers, setLoadingAnswers] = useState(false);
  const [loadingSkipped, setLoadingSkipped] = useState(false);

  async function getAnswers() {
    const fetchedAnswers = await getUserAnswers();
    setAnswers(fetchedAnswers);
  }

  async function getSkipped() {
    const fetchedSkipped = await getUserSkipped();
    setSkipped(fetchedSkipped);
  }

  useEffect(() => {
    getAnswers();
    getSkipped();
  }, []);

  return (
    <div>
      <pre>
        <code>{JSON.stringify(skipped)}</code>
      </pre>
      <h1>data</h1>
      {answers.length > 0 &&
        answers.map((answer, i) => <AnswerCard answer={answer} key={i} />)}
      <h1>skipped</h1>
      {skipped.length > 0 &&
        skipped.map((question, i) => (
          <SkippedCard question={question} key={i} />
        ))}
    </div>
  );
}
