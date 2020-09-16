import {EntityRepository, Repository} from "typeorm";
import Company from "../entities/Company";

@EntityRepository(Company)
class CompanyRepository extends Repository<Company> {
  /**
   * 회사 생성
   */
  async createCompany(companyName: string): Promise<Company> {
    const company = this.create();
    company.name = companyName;
    return await this.save(company);
  }

  /**
   * 회사 찾기
   */
  async findCompany(companyName: string): Promise<Company | undefined> {
    const company = await this.findOne({where: {name: companyName}})
    return company;
  }

  /**
   * 회사 존재 여부
   */
  async isCompany(companyName: string) {
    const companyCount = await this.createQueryBuilder("company")
      .where("company.name = :companyName", {companyName})
      .getCount();

    if (companyCount > 0)
      return true;
    return false;
  }
}

export default CompanyRepository;