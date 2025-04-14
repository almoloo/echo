"use client";

import { generateQuestions } from "@/lib/actions";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function TrainingPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);

  async function generateQuestionsHandler() {
    try {
      setLoading(true);
      const answers = await generateQuestions(session?.user.address!);
      console.log(answers);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div>
      <h1>training</h1>
      <button onClick={generateQuestionsHandler}>
        {loading ? "Loading..." : "Generate questions"}
      </button>
    </div>
  );
}
