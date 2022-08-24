export interface IUser {
  _id: string;
  email: string;
  password?: string;
  passwordConfirm?: string | undefined;
  firstName?: string;
  lastName?: string;
  photoUrl?: string;
  __v?: number;
}

export interface IUserData {
  status: string;
  token: string;
  data: {
    user: IUser;
  };
  message?: string;
}
