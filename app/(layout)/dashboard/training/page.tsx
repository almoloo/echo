"use client";

import QuestionCard from "@/components/training/question-card";
import { saveAnswers } from "@/lib/actions/training";
import { generateQuestions } from "@/lib/actions/ai";
import { useContext, useState } from "react";
import Heading from "@/components/layout/heading";
import {
  LayoutDashboardIcon,
  LoaderIcon,
  SaveIcon,
  SparklesIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { characterContext } from "@/services/character-provider";

export default function TrainingPage() {
  const characterData = useContext(characterContext);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<QuestionAnswer[]>([]);
  const [skipped, setSkipped] = useState<Question[]>([]);

  function nextQuestion(currentQuestion: Question) {
    setQuestions((prev) =>
      prev.filter(
        (questionItem) => questionItem.question !== currentQuestion.question
      )
    );

    if (questions.length === 0) {
      updateAnswers();
    }
  }

  function submitAnswer(answer: QuestionAnswer) {
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
      setQuestions(questionsArray);
    } catch (error) {
      toast(error instanceof Error ? error.message : "An error has occured!");
    } finally {
      setLoading(false);
    }
  }

  async function updateAnswers() {
    try {
      setSaving(true);
      const submittedAnswers = await saveAnswers(answers, skipped);
      setAnswers([]);
      setSkipped([]);
      characterData?.updateInfo();
    } catch (error) {
      toast(error instanceof Error ? error.message : "An error has occured!");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <Heading
        title="Training"
        subtitle="Answer questions to help your Echo truly know you — your journey, your passions, your connections.
Every answer becomes part of your story it can share with the world."
        icon={<LayoutDashboardIcon />}
      />
      {questions.length === 0 && !saving && (
        <div className="bg-slate-50 p-5 border rounded-xl">
          {answers.length === 0 && skipped.length === 0 ? (
            <>
              <h3 className="font-medium text-lg">Ready to Build Your Echo?</h3>
              <p className="mt-1 mb-3 text-slate-600 text-sm">
                We’ll generate a few questions to help your Echo truly know you.
                You can answer as much or as little as you like.
              </p>
            </>
          ) : (
            <>
              <h3 className="font-medium text-lg">Wanna keep going?</h3>
              <p className="mt-1 mb-3 text-slate-600 text-sm">
                You’ve answered everything so far. Ready for a fresh batch of
                questions?
              </p>
            </>
          )}
          <Button
            size="lg"
            onClick={generateQuestionsHandler}
            disabled={loading}
            className="bg-gradient-to-r from-0% from-indigo-500 hover:from-indigo-700 to-100% to-pink-600 hover:to-pink-800 disabled:grayscale transition-colors cursor-pointer"
          >
            {loading ? (
              <LoaderIcon className="animate-spin" />
            ) : (
              <SparklesIcon />
            )}
            {answers.length === 0 && skipped.length === 0
              ? "Generate My Questions"
              : "Generate More Questions"}
          </Button>
        </div>
      )}
      {questions.length > 0 && !saving && (
        <QuestionCard
          question={questions[0]}
          skipQuestion={skipQuestion}
          submitAnswer={submitAnswer}
        />
      )}
      {(answers.length > 0 || skipped.length > 0) && (
        <div className="flex items-center bg-slate-50 mt-3 p-5 border rounded-xl">
          <div className="text-sm">
            Your progress will only be saved once you push this button. Don’t
            worry — you can edit later.
          </div>
          <Button
            onClick={updateAnswers}
            className="ml-auto cursor-pointer"
            size="lg"
            disabled={saving}
          >
            {saving ? <LoaderIcon className="animate-spin" /> : <SaveIcon />}
            Save my Answers
          </Button>
        </div>
      )}
    </div>
  );
}
