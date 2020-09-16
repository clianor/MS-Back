import {EntityRepository, getCustomRepository, Repository} from "typeorm";
import User from "../entities/User";
import argon2 from "argon2";
import CompanyRepository from "./CompanyRepository";
import {LoginResultUser} from "../types/auth";

type loginUserProps = {
  email: string;
  password: string;
}

type registerUserProps = {
  email: string;
  password: string;
  companyName: string;
}

type findUserProps = {
  email: string;
}

@EntityRepository(User)
class UserRepository extends Repository<User> {
  /**
   * 로그인
   * @param {loginUserProps} values 로그인에 필요한 유저정보 입니다.
   */
  async loginUser({email, password}: loginUserProps): Promise<LoginResultUser> {
    const user = await this.findOne({where: {email}});
    if (!user) {
      return {
        errors: [
          {
            field: "email",
            message: "존재하지 않는 이메일입니다.",
          },
        ],
      };
    }

    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "패스워드가 일치하지 않습니다.",
          },
        ],
      };
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
      }
    };
  }

  /**
   * 회원가입
   * @param {registerUserProps} values 회원가입에 필요한 유저정보 입니다.
   */
  async registerUser({email, password, companyName}: registerUserProps) {
    const hashedPassword = await argon2.hash(password);

    await this.queryRunner?.startTransaction();
    // 유저 존재 여부 확인 후 유저 추가
    let company;
    let user;
    try {
      // 회사 존재 여부 확인 후 없으면 회사 추가
      const companyRepository = getCustomRepository(CompanyRepository);
      const isCompany = await companyRepository.isCompany(companyName);

      if (!isCompany) {
        // 회사가 존재하지 않으면 생성
        company = await companyRepository.createCompany(companyName);
      } else {
        company = await companyRepository.findCompany(companyName);
      }

      user = this.create();
      user.email = email;
      user.password = hashedPassword;
      // @ts-ignore
      user.companyId = company.id;
      await this.save(user);

      await this.queryRunner?.commitTransaction();
    } catch (error) {
      await this.queryRunner?.rollbackTransaction();
      return;
    }

    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    };
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