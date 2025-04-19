import { markAnswerAsSkipped, modifyAnswer, removeAnswer } from "@/lib/actions";

interface AnswerCardProp {
  answer: QuestionAnswer;
}

export default function AnswerCard({ answer }: AnswerCardProp) {
  async function handleModifyAnswer(formData: FormData) {
    const newAnswer = formData.get("answer")?.toString().trim();
    try {
      if (newAnswer === "") throw new Error("Please provide a new answer!");

      const res = await modifyAnswer(answer.id!, newAnswer!);
      if (!res)
        throw new Error("There was an error while updating this answer!");

      console.log("Updated answer");
    } catch (error) {
      console.error(error);
    }
  }

  async function handleRemoveAnswer() {
    try {
      const res = await removeAnswer(answer.id!);
      if (!res)
        throw new Error("There was an error while removing this answer!");

      console.log("Removed answer");
    } catch (error) {
      console.error(error);
    }
  }

  async function handleMarkSkipped() {
    try {
      const res = await markAnswerAsSkipped(answer.id!);
      if (!res)
        throw new Error(
          "There was an error while marking this answer as skipped!"
        );

      console.log("marked as skipped");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="border mb-3">
      <p>{answer.type}</p>
      <p>{answer.question}</p>
      <p>{answer.answer}</p>
      <p>{answer.id}</p>
      <hr />
      <form action={handleModifyAnswer}>
        <h2>CHANGE YOUR ANSWER:</h2>
        <input type="text" placeholder="New answer" name="answer" />
        <button type="submit">Change answer</button>
      </form>
      <hr />
      <div>
        <h2>REMOVE THIS ANSWER:</h2>
        <button onClick={handleRemoveAnswer}>Remove</button>
      </div>
      <hr />
      <div>
        <h2>MARK THIS ANSWER AS SKIPPED:</h2>
        <button onClick={handleMarkSkipped}>Mark as skipped</button>
      </div>
    </div>
  );
}
