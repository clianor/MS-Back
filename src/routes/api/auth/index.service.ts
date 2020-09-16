import {Request, Response} from "express";
import {getCustomRepository} from "typeorm";
import {validateRegister} from "../../../utils/auth/validateRegister";
import {RegisterInput} from "../../../types/auth";
import UserRepository from "../../../repository/UserRepository";
import User from "../../../entities/User";

/**
 * 회원가입 로직
 */
export const registerService = async (req: Request, res: Response) => {
  const registerInput: RegisterInput = req.body;

  if (!registerInput) {
    res.status(400).json({
      errors: [{
        field: "etc",
        message: "유효하지 않은 데이터입니다.",
      }],
    });
    return;
  }

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

    if (!user) {
      res.status(500).json({
        errors: {
          field: "etc",
          message: "회사쪽 회원가입에 실패하였습니다.",
        }
      });
      return;
    }
  } catch (error) {
    res.status(500).json({
      errors: {
        field: "etc",
        message: "회원가입에 실패하였습니다.",
      }
    });
    return;
  }

  // @ts-ignore
  req.session?.userId = user.id;
  res.status(200).json({
    user: user,
  });
  return;
};