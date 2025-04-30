"use client";

import Heading from "@/components/layout/heading";
import AnswerCard from "@/components/training/answer-card";
import SkippedCard from "@/components/training/skipped-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUserAnswers, getUserSkipped } from "@/lib/data/training";
import { DatabaseIcon, FrownIcon, SmileIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AvailableDataPage() {
  const [answers, setAnswers] = useState<QuestionAnswer[]>([]);
  const [skipped, setSkipped] = useState<Question[]>([]);
  const [loadingAnswers, setLoadingAnswers] = useState(true);
  const [loadingSkipped, setLoadingSkipped] = useState(true);

  async function getAnswers() {
    try {
      setLoadingAnswers(true);
      const fetchedAnswers = await getUserAnswers();
      setAnswers(fetchedAnswers);
    } catch (error) {
      toast(error instanceof Error ? error.message : "An error has occured!");
    } finally {
      setLoadingAnswers(false);
    }
  }

  async function getSkipped() {
    try {
      setLoadingSkipped(true);
      const fetchedSkipped = await getUserSkipped();
      setSkipped(fetchedSkipped);
    } catch (error) {
      toast(error instanceof Error ? error.message : "An error has occured!");
    } finally {
      setLoadingSkipped(false);
    }
  }

  function removeFromList(answer: QuestionAnswer | Question) {
    setAnswers((prev) => prev.filter((elem) => elem.id !== answer.id));
    setSkipped((prev) => prev.filter((elem) => elem.id !== answer.id));
  }

  function modifyList(answer: QuestionAnswer | Question, newAnswer: string) {
    const isNewAnswer =
      skipped.filter((elem) => elem.id === answer.id).length > 0;
    if (!isNewAnswer) {
      const updatedAnswers = answers.map((elem) =>
        elem.id === answer.id ? { ...elem, answer: newAnswer } : elem
      );
      setAnswers(updatedAnswers);
    } else {
      const item = skipped.filter((elem) => elem.id === answer.id);
      const newItem: QuestionAnswer = { ...item[0], answer: newAnswer };
      setAnswers((prev) => [...prev, newItem]);
      setSkipped((prev) => prev.filter((elem) => elem.id !== answer.id));
    }
  }

  useEffect(() => {
    getAnswers();
    getSkipped();
  }, []);

  function LoadingState() {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="rounded-xl w-full h-[200px]" />
        <Skeleton className="rounded-xl w-full h-[200px]" />
        <Skeleton className="rounded-xl w-full h-[200px]" />
      </div>
    );
  }

  return (
    <div>
      <Heading
        title="My Data"
        subtitle="Take a moment to reflect on your past answers. Whether you want to revise a thought, delete something old, or finally respond to skipped questions, it’s all right here."
        icon={<DatabaseIcon />}
      />

      <Tabs defaultValue="answers">
        <TabsList className="mb-1">
          <TabsTrigger value="answers">Answers</TabsTrigger>
          <TabsTrigger value="skipped">Skipped Questions</TabsTrigger>
        </TabsList>
        <TabsContent value="answers" className="flex flex-col gap-2">
          {loadingAnswers ? (
            <LoadingState />
          ) : (
            <>
              {answers.length > 0 ? (
                answers.map((answer, i) => (
                  <AnswerCard
                    answer={answer}
                    removeFromList={removeFromList}
                    modifyList={modifyList}
                    key={i}
                  />
                ))
              ) : (
                <Alert className="bg-slate-50">
                  <FrownIcon className="w-4 h-4" />
                  <AlertTitle>No Answers Yet</AlertTitle>
                  <AlertDescription>
                    You haven’t answered any questions yet. Once you start
                    sharing your thoughts, they’ll appear here for you to
                    revisit, edit, or remove anytime.
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}
        </TabsContent>
        <TabsContent value="skipped" className="flex flex-col gap-2">
          {loadingSkipped ? (
            <LoadingState />
          ) : (
            <>
              {skipped.length > 0 ? (
                skipped.map((question, i) => (
                  <SkippedCard
                    question={question}
                    removeFromList={removeFromList}
                    modifyList={modifyList}
                    key={i}
                  />
                ))
              ) : (
                <Alert className="bg-slate-50">
                  <SmileIcon className="w-4 h-4" />
                  <AlertTitle>No Skipped Questions</AlertTitle>
                  <AlertDescription>
                    Looks like you’re all caught up! Any questions you choose to
                    skip will show up here in case you change your mind later.
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
