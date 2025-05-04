interface Message {
  id?: string;
  from: "Assistant" | "User";
  text: string;
  name?: string;
  avatar?: string;
}

interface DeliveredMessage {
  id?: string;
  from: string;
  to: string;
  text: string;
  read?: boolean;
  created_at?: string;
}
