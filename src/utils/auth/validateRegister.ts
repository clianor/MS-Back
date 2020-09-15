import {UserInput} from "../../types/auth";

export const validateRegister = (values: UserInput): any => {
  if (!values.email.includes("@")) {
    return [
      {
        field: "email",
        message: "유효하지 않은 이메일입니다.",
      },
    ];
  }

  if (values.password.length < 8) {
    return [
      {
        field: "password",
        message: "패스워드는 8자 이상 되어야 합니다.",
      },
    ];
  }

  if (values.password !== values.passwordConfirm) {
    return [
      {
        field: "password",
        message: "패스워드와 패스워드 확인이 다릅니다.",
      },
    ];
  }
}