import { Badge } from "@/components/ui/badge";
import { identityStatsInfo } from "@/lib/constants";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CommandIcon, CornerDownLeft, InfoIcon } from "lucide-react";
import { useRef } from "react";

interface QuestionCardProps {
  question: Question;
  submitAnswer: (arg: QuestionAnswer) => void;
  skipQuestion: (arg: Question) => void;
}

export default function QuestionCard({
  question,
  submitAnswer,
  skipQuestion,
}: QuestionCardProps) {
  const form = useRef<HTMLFormElement | null>(null);

  function handleSubmit(formData: FormData) {
    const answer = formData.get("answer")?.toString();
    if (!answer) return;

    submitAnswer({
      ...question,
      answer,
    });
  }

  function handleReset() {
    skipQuestion(question);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.code === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      form.current?.requestSubmit();
    }
  }

  const badgeTextColor = identityStatsInfo[question.type].textColor;
  const badgeBgColor = identityStatsInfo[question.type].color;

  return (
    <form
      action={handleSubmit}
      onReset={handleReset}
      className="p-5 border rounded-xl"
      ref={form}
    >
      <Badge
        variant="secondary"
        className={`${badgeTextColor} ${badgeBgColor} mb-2`}
      >
        {question.type}
      </Badge>
      <p className="mb-4 font-serif font-bold text-xl">
        Q: {question.question}
      </p>
      <Textarea
        placeholder="Please provide your answer or skip..."
        name="answer"
        required
        onKeyDown={handleKeyDown}
      />
      <small className="flex items-center gap-1 mt-1 text-slate-400">
        <InfoIcon className="w-4 h-4" />
        You can skip or update your answers anytime.
      </small>
      <div className="flex flex-wrap justify-end gap-2 mt-2">
        <Button type="reset" variant="ghost" className="cursor-pointer">
          Skip Question
        </Button>
        <Button type="submit" className="cursor-pointer" variant="secondary">
          <div className="flex items-center gap-1">
            <CommandIcon className="text-slate-400" />
            <CornerDownLeft className="text-slate-400" />
          </div>
          Continue
        </Button>
      </div>
    </form>
  );
}
