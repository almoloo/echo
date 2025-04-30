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
import { removeSkipped } from "@/lib/actions/training";
import { characterContext } from "@/services/character-provider";
import { DeleteIcon, LoaderIcon } from "lucide-react";
import { useContext, useState } from "react";
import { toast } from "sonner";

interface SkippedCardRemoveProps {
  question: Question;
  removeFromList: (question: Question) => void;
}

export default function SkippedCardRemove(props: SkippedCardRemoveProps) {
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
      const res = await removeSkipped(props.question.id!);
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
          Remove From Skipped
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove this skipped question?</AlertDialogTitle>
          <AlertDialogDescription>
            This question will be permanently removed from your skipped list.
            You won’t be able to answer it later unless it’s asked again in the
            training area.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={loading} onClick={handleRemoveAnswer}>
            {loading ? <LoaderIcon className="animate-spin" /> : <DeleteIcon />}
            Remove From Skipped
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
