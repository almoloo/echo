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
