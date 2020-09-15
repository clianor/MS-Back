import {EntityRepository, Repository} from "typeorm";
import {UserInput} from "../types/auth";
import User from "../entities/User";
import argon2 from "argon2";

type registerUserProps = {
  email: string;
  password: string;
}

type findUserProps = {
  email?: string;
}

@EntityRepository(User)
class UserRepository extends Repository<User> {
  /**
   * 회원가입
   * @param {UserInput} values 회원가입에 필요한 유저정보 입니다.
   */
  async registerUser({email, password}: registerUserProps) {
    const hashedPassword = await argon2.hash(password);

    let user;
    await this.queryRunner?.startTransaction();
    try {
      user = this.create();
      user.email = email;
      user.password = hashedPassword;
      await this.save(user);

      await this.queryRunner?.commitTransaction();
    } catch (error) {
      await this.queryRunner?.rollbackTransaction();
      return;
    }

    return user;
  }

  /**
   * 유저 존재 여부
   */
  async isUser({email}: findUserProps) {
    const userCount = await this.createQueryBuilder("user")
      .where("user.email = :email", {email})
      .getCount();

    if (userCount > 0)
      return true;

    return false;
  }
}

export default UserRepository;