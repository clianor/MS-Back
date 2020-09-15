import {Request, Response} from "express";
import {getCustomRepository} from "typeorm";
import {validateRegister} from "../../../utils/auth/validateRegister";
import {RegisterInput} from "../../../types/auth";
import UserRepository from "../../../repository/UserRepository";

/**
 * 회원가입 로직
 */
export const registerService = async (req: Request, res: Response) => {
  const registerInput: RegisterInput = req.body;

  const errors = validateRegister(registerInput);
  if (errors) {
    res.status(400).json({
      errors,
      user: undefined
    });
    return;
  }

  const userRepository = getCustomRepository(UserRepository);
  const isUser = await userRepository.isUser(registerInput);

  if (isUser) {
    res.status(409).json({
      errors: [
        {
          field: "email",
          message: "이미 존재하는 이메일입니다.",
        },
      ],
    })
    return;
  }

  let user;
  try {
    const userRepository = getCustomRepository(UserRepository);
    user = await userRepository.registerUser(registerInput);
  } catch (error) {
    res.status(500).json({
      errors: {
        field: "etc",
        message: "회원가입에 실패하였습니다.",
      }
    });
    return;
  }

  res.status(200).json({
    user: user,
  });
  return;
};