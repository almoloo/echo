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
import { modifyAnswer } from "@/lib/actions/training";
import { toast } from "sonner";
import { characterContext } from "@/services/character-provider";

interface QuestionCardChangeProps {
  answer: QuestionAnswer;
  modifyList: (answer: QuestionAnswer, newAnswer: string) => void;
}

export default function QuestionCardChange(props: QuestionCardChangeProps) {
  const characterData = useContext(characterContext);
  const answerInput = useRef<HTMLTextAreaElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  function handleOpen() {
    if (loading) return;
    setOpen(!open);
  }

  async function handleModifyAnswer(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    const newAnswer = answerInput.current?.value;
    try {
      setLoading(true);
      if (newAnswer === "" || !newAnswer)
        throw new Error("Please provide a new answer!");

      const res = await modifyAnswer(props.answer.id!, newAnswer!);
      if (!res)
        throw new Error("There was an error while updating this answer!");

      setOpen(false);
      props.modifyList(props.answer, newAnswer);
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
          Change Answer
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Changed Your Mind?</DialogTitle>
          <DialogDescription className="font-serif">
            Q: {props.answer.question}
          </DialogDescription>
        </DialogHeader>
        <div>
          <Textarea
            defaultValue={props.answer.answer}
            ref={answerInput}
            disabled={loading}
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button disabled={loading} onClick={handleModifyAnswer}>
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
