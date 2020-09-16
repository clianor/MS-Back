import {EntityRepository, getCustomRepository, Repository} from "typeorm";
import {RegisterInput} from "../types/auth";
import User from "../entities/User";
import argon2 from "argon2";
import CompanyRepository from "./CompanyRepository";

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
   * 회원가입
   * @param {RegisterInput} values 회원가입에 필요한 유저정보 입니다.
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
      const isCompany = await companyRepository.isCompany(companyName)

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

      user = await this.findOne({
        select: ["id", "email", "createdAt"],
        where: {email}
      })

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