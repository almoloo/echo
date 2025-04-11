interface User {
  _id?: ObjectId;
  address?: string;
  info?: UserInfo;
  chatThread?: string;
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
