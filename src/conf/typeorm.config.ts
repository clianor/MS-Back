import {ConnectionOptions} from "typeorm";
import {ROOT_DIR, NODE_ENV} from "./constans";

const options: ConnectionOptions = {
  type: "sqlite",
  database: `${ROOT_DIR}/db.sqlite`,
  entities: ["src/entities/*.ts", "src/entities/*.js"],
  logging: !NODE_ENV,
  synchronize: true,
};

export default options;
