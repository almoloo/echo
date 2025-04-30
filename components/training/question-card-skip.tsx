"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { LoaderIcon, RedoIcon } from "lucide-react";
import { useContext, useState } from "react";
import { markAnswerAsSkipped } from "@/lib/actions/training";
import { toast } from "sonner";
import { characterContext } from "@/services/character-provider";

interface QuestionCardSkipProps {
  answer: QuestionAnswer;
  removeFromList: (answer: QuestionAnswer) => void;
}

export default function QuestionCardSkip(props: QuestionCardSkipProps) {
  const characterData = useContext(characterContext);

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  function handleOpen() {
    setOpen(!open);
  }

  async function handleMarkSkipped(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await markAnswerAsSkipped(props.answer.id!);
      if (!res)
        throw new Error(
          "There was an error while marking this answer as skipped!"
        );

      setOpen(false);
      props.removeFromList(props.answer);
      characterData?.updateInfo();
    } catch (error) {
      toast(error instanceof Error ? error.message : "An error has occured!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="secondary" size="sm">
          <RedoIcon />
          Mark as Skipped
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Mark this question as skipped?</AlertDialogTitle>
          <AlertDialogDescription>
            You can come back and answer it later. It’ll be moved to your list
            of skipped questions.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={loading} onClick={handleMarkSkipped}>
            {loading ? <LoaderIcon className="animate-spin" /> : <RedoIcon />}
            Mark as Skipped
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
