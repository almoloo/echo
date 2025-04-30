import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { identityStatsInfo } from "@/lib/constants";
import SkippedCardChange from "@/components/training/skipped-card-change";
import SkippedCardRemove from "./skipped-card-remove";

interface SkippedCardProp {
  question: Question;
  removeFromList: (question: Question) => void;
  modifyList: (answer: Question, newAnswer: string) => void;
}

export default function SkippedCard({
  question,
  removeFromList,
  modifyList,
}: SkippedCardProp) {
  const badgeTextColor = identityStatsInfo[question.type].textColor;
  const badgeBgColor = identityStatsInfo[question.type].color;

  return (
    <Card>
      <CardHeader>
        <CardDescription className="mb-2">
          <Badge className={`${badgeBgColor} ${badgeTextColor}`}>
            {question.type}
          </Badge>
        </CardDescription>
        <CardTitle className="font-serif leading-relaxed">
          Q: {question.question}
        </CardTitle>
      </CardHeader>
      <CardFooter className="flex gap-2">
        <SkippedCardChange question={question} modifyList={modifyList} />
        <SkippedCardRemove
          question={question}
          removeFromList={removeFromList}
        />
      </CardFooter>
    </Card>
  );
}
