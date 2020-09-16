import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity, ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import Company from "./Company";

@Entity()
class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({unique: true})
  email!: string;

  @Column()
  password!: string;

  @Column({default: false})
  isAdmin!: boolean;

  @Column()
  companyId: number;

  @ManyToOne(() => Company, (company) => company.id)
  company!: Company;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}

export default User;