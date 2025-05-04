"use client";

import { useFormStatus } from "react-dom";

interface SuggestionBoxProps {
  text: string;
}

export default function SuggestionBox({ text }: SuggestionBoxProps) {
  const { pending } = useFormStatus();

  return (
    <>
      <input type="hidden" name="q" value={text} />
      <button
        type="submit"
        className="bg-indigo-300/15 hover:bg-indigo-400 active:bg-indigo-500 px-2 py-1 rounded-lg text-indigo-600 text-xs transition-colors cursor-pointer"
        disabled={pending}
      >
        {text}
      </button>
    </>
  );
}
