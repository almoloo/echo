interface ProfileImage {
  width: number;
  height: number;
  verification: {
    method: string;
    data: string;
  };
  url: string;
}
