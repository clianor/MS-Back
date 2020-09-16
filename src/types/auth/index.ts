export type RegisterInput = {
  email: string;
  password: string;
  passwordConfirm: string;
  companyName: string;
}

export type LoginInput = {
  email: string;
  password: string;
}

export type AuthResultUser = {
  errors?: [{
    field: string;
    message: string;
  },],
  user?: {
    id: number;
    email: string;
    companyName?: string;
  }
}