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
import { removeAskedQuestion } from "@/lib/actions/training";
import { characterContext } from "@/services/character-provider";
import { DeleteIcon, LoaderIcon } from "lucide-react";
import { useContext, useState } from "react";
import { toast } from "sonner";

interface AskedQuestionRemoveProps {
  question: AskedQuestion;
  removeFromList: (question: AskedQuestion) => void;
}

export default function AskedQuestionRemove(props: AskedQuestionRemoveProps) {
  const characterData = useContext(characterContext);

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  function handleOpen() {
    setOpen(!open);
  }

  async function handleRemoveQuestion(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await removeAskedQuestion(props.question.id!);
      if (!res)
        throw new Error("There was an error while removing this answer!");

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
    <AlertDialog open={open} onOpenChange={handleOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="secondary" size="sm">
          <DeleteIcon />
          Remove
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove this question?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will permanently delete this question. You won’t be able
            to recover it.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={loading} onClick={handleRemoveQuestion}>
            {loading ? <LoaderIcon className="animate-spin" /> : <DeleteIcon />}
            Remove Question
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
