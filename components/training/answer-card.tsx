import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { identityStatsInfo } from "@/lib/constants";
import QuestionCardSkip from "@/components/training/question-card-skip";
import QuestionCardRemove from "@/components/training/question-card-remove";
import QuestionCardChange from "./question-card-change";

interface AnswerCardProp {
  answer: QuestionAnswer;
  removeFromList: (answer: QuestionAnswer) => void;
  modifyList: (answer: QuestionAnswer, newAnswer: string) => void;
}

export default function AnswerCard({
  answer,
  removeFromList,
  modifyList,
}: AnswerCardProp) {
  const badgeTextColor = identityStatsInfo[answer.type].textColor;
  const badgeBgColor = identityStatsInfo[answer.type].color;

  return (
    <Card>
      <CardHeader>
        <CardDescription className="mb-2">
          <Badge className={`${badgeBgColor} ${badgeTextColor}`}>
            {answer.type}
          </Badge>
        </CardDescription>
        <CardTitle className="font-serif leading-relaxed">
          Q: {answer.question}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          <span className="text-slate-500">A:</span> {answer.answer}
        </p>
      </CardContent>
      <CardFooter className="flex gap-2">
        <QuestionCardChange answer={answer} modifyList={modifyList} />
        <QuestionCardRemove answer={answer} removeFromList={removeFromList} />
        <QuestionCardSkip answer={answer} removeFromList={removeFromList} />
      </CardFooter>
    </Card>
  );
}
