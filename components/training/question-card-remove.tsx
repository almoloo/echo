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
import { removeAnswer } from "@/lib/actions/training";
import { characterContext } from "@/services/character-provider";
import { DeleteIcon, LoaderIcon } from "lucide-react";
import { useContext, useState } from "react";
import { toast } from "sonner";

interface QuestionCardRemoveProps {
  answer: QuestionAnswer;
  removeFromList: (answer: QuestionAnswer) => void;
}

export default function QuestionCardRemove(props: QuestionCardRemoveProps) {
  const characterData = useContext(characterContext);

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  function handleOpen() {
    setOpen(!open);
  }

  async function handleRemoveAnswer(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await removeAnswer(props.answer.id!);
      if (!res)
        throw new Error("There was an error while removing this answer!");

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
          <DeleteIcon />
          Remove Answer
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove this answer?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will permanently delete your answer. You won’t be able
            to recover it.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={loading} onClick={handleRemoveAnswer}>
            {loading ? <LoaderIcon className="animate-spin" /> : <DeleteIcon />}
            Remove Answer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
