interface User {
  _id?: ObjectId;
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
  questions?: QuestionAnswer[];
  skipped?: string[];
}
