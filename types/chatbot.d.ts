interface Message {
  id?: string;
  from: "Assistant" | "User";
  text: string;
  name?: string;
  avatar?: string;
}
