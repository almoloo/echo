interface Message {
  from: "Assistant" | "User";
  text: string;
}

interface UserMessage {
  from: string;
  to: string;
  text: string;
  read: boolean;
}
