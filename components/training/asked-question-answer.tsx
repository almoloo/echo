import { useContext, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { LoaderIcon, PenLineIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { answerAskedQuestion } from "@/lib/actions/training";
import { toast } from "sonner";
import { characterContext } from "@/services/character-provider";

interface QuestionCardChangeProps {
  question: AskedQuestion;
  removeFromList: (question: AskedQuestion) => void;
}

export default function AskedQuestionAnswer(props: QuestionCardChangeProps) {
  const characterData = useContext(characterContext);
  const answerInput = useRef<HTMLTextAreaElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  function handleOpen() {
    if (loading) return;
    setOpen(!open);
  }

  async function handleAnswer(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    const newAnswer = answerInput.current?.value;
    try {
      setLoading(true);
      if (newAnswer === "" || !newAnswer)
        throw new Error("Please provide a new answer!");

      const res = await answerAskedQuestion(props.question.id!, newAnswer!);
      if (!res)
        throw new Error("There was an error while updating this answer!");

      setOpen(false);
      props.removeFromList(props.question);
      characterData?.updateInfo();
    } catch (error) {
      toast(error instanceof Error ? error.message : "An error has occured!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          <PenLineIcon />
          Answer
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Answer to This Question</DialogTitle>
          <DialogDescription className="font-serif">
            Q: {props.question.question}
          </DialogDescription>
        </DialogHeader>
        <div>
          <Textarea ref={answerInput} disabled={loading} />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button disabled={loading} onClick={handleAnswer}>
            {loading ? (
              <LoaderIcon className="animate-spin" />
            ) : (
              <PenLineIcon />
            )}
            Save Answer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
