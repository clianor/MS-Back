import {getCustomRepository} from "typeorm";
import UserRepository from "../../repository/UserRepository";

const existUser = async (req: any) => {
  const userId = req.session.userId;
  const userRepository = getCustomRepository(UserRepository);
  const isUser = await userRepository.findUser({id: userId}) ? true : false;
  return isUser;
}

export default existUser;
