import { ConnectionOptions } from "typeorm";
import { ROOT_DIR, NODE_ENV } from "./constans";

const options: ConnectionOptions = {
  type: "sqlite",
  database: `${ROOT_DIR}/db.sqlite`,
  entities: ["../entity/*.js", "../entity/*.ts"],
  logging: !NODE_ENV,
  synchronize: true,
};

export default options;
