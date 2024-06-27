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
  createdAt: number;
  updatedAt: number;
};
export type IUser = {
  _id: string;
  username: string;
  imageUrl: string;
  email: string;
  role: "admin" | "user";
};
export type ICommnets = {
  _id: string;
  content: string;
  postId: string;
  userId: string;
  likes: string[];
  createdAt: number;
  updatedAt: number;
};
