export type ValidationError = {
  path: string;
  msg: string;
};

export type IUserCredential = {
  username?: string;
  email: string;
  password: string;
};
