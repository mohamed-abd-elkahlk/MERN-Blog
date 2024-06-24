export type ValidationError = {
  path: string;
  msg: string;
};

export type IUserCredential = {
  username?: string;
  email: string;
  password: string;
};
export type IPost = {
  _id: string;
  author: string;
  title: string;
  content: string;
  category: string;
  slug: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
};
