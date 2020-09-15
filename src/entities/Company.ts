import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import User from "./User";

@Entity()
class Company extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({unique: true})
  name!: string;

  @OneToMany(() => User, (user) => user.id)
  members: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;
}

export default Company;