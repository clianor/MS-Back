import {getCustomRepository} from "typeorm";
import {validateRegister} from "../../../utils/auth/validateRegister";
import {LoginInput, RegisterInput} from "../../../types/auth";
import UserRepository from "../../../repository/UserRepository";
import {MyService} from "../../../types/base";

/**
 * 회원가입 로직
 */
export const registerService: MyService = async (req, res) => {
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

  let result;
  try {
    const userRepository = getCustomRepository(UserRepository);
    result = await userRepository.registerUser(registerInput);

    if (result.errors) {
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

  if (!result.user) {
    res.status(500).json({
      errors: {
        field: "etc",
        message: "회원가입에 실패하였습니다.",
      }
    });
    return;
  }

  req.session.userId = result.user.id;
  res.status(200).json({
    user: result.user,
  });
  return;
};

/**
 * 로그인 로직
 */
export const loginService: MyService = async (req, res) => {
  const loginInput: LoginInput = req.body;

  const userRepository = getCustomRepository(UserRepository);
  let result;

  try {
    result = await userRepository.loginUser(loginInput);
  } catch (error) {
    res.status(500).json({
      errors: [{
        field: "etc",
        message: "알 수 없는 에러가 발생했습니다.",
      }],
    });
    return;
  }

  // 에러가 존재하는 경우
  if (result.errors) {
    if (result.errors[0].field === "email") {
      res.status(404).json({
        errors: result.errors,
      });
    } else if (result.errors[0].field === "password") {
      res.status(404).json({
        errors: result.errors,
      });
    } else {
      res.status(500).json({
        errors: [{
          field: "etc",
          message: "알 수 없는 에러가 발생했습니다.",
        }],
      });
    }
    return;
  }

  const {user} = result;
  if (!user) {
    res.status(500).json({
      errors: [{
        field: "etc",
        message: "알 수 없는 에러가 발생했습니다.",
      }],
    });
    return;
  }

  req.session.userId = user.id;
  res.status(200).json({
    user: user,
  });
};

/**
 * 내정보
 */
export const meService: MyService = async (req, res) => {
  const userId = req.session.userId;

  if (!userId) {
    res.status(404).json({
      errors: [{
        field: "email",
        message: "이메일을 찾을 수 없습니다.",
      }],
    });
    return;
  }

  const userRepository = getCustomRepository(UserRepository);
  const user = await userRepository.findUser({id: userId});

  res.status(200).json({
    user
  })
}