import { answerSkipped, removeSkipped } from "@/lib/actions";

interface SkippedCardProp {
  question: Question;
}

export default function SkippedCard({ question }: SkippedCardProp) {
  async function handleRemoveSkipped() {
    try {
      const res = await removeSkipped(question.id!);
      if (!res) throw new Error("There was an error while removing this item!");

      console.log("Removed item");
    } catch (error) {
      console.error(error);
    }
  }

  async function handleSubmitAnswer(formData: FormData) {
    const answer = formData.get("answer")?.toString().trim();
    try {
      if (answer === "") throw new Error("Please provide an answer!");

      const res = await answerSkipped(question.id!, answer!);
      if (!res)
        throw new Error("There was an error while submitting this answer!");

      console.log("Submitted answer");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="border mb-3">
      <p>{question.type}</p>
      <p>{question.question}</p>
      <p>{question.id}</p>
      <hr />
      <form action={handleSubmitAnswer}>
        <h2>ADD YOUR ANSWER:</h2>
        <input type="text" placeholder="New answer" name="answer" />
        <button type="submit">Change answer</button>
      </form>
      <hr />
      <div>
        <h2>REMOVE THIS ITEM:</h2>
        <button onClick={handleRemoveSkipped}>Remove</button>
      </div>
    </div>
  );
}
