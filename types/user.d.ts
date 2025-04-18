interface User {
  _id?: ObjectId;
  created_at?: number;
  address?: string;
  info?: UserInfo;
  assistantId?: string;
  infoFileId?: string;
  trainingAssistantId?: string;
  trainingAssistantThreadId?: string;
}

interface UserInfo {
  name?: string;
  bio?: string;
  email?: string;
  avatar?: string;
  links?: {
    title: string;
    url: string;
  }[];
  tags?: string[];
}

interface UserObject extends User {
  answers?: QuestionAnswer[];
  skipped?: Question[];
}

type CareerLevel =
  | "Rookie"
  | "Apprentice"
  | "Portfolio Master"
  | "Workoholic"
  | "The Echomaker";

type ConnectionLevel =
  | "Introvert"
  | "Ambivert"
  | "Extrovert"
  | "The Guy"
  | "The Echomaker";

type IdentityLevel =
  | "Wandering Soul"
  | "Self Aware"
  | "Storyteller"
  | "Archivist"
  | "The Echomaker";

interface CharacterLevel {
  level: number;
  min: number;
  max: number;
  title: IdentityLevel | CareerLevel | ConnectionLevel;
}

interface Character {
  percentage: number;
  level: CharacterLevel;
}

interface CharacterInfo {
  identity: Character;
  career: Character;
  connection: Character;
}
