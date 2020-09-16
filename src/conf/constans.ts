import path from "path";

export const ROOT_DIR: string = path.resolve(__dirname, "../..");

export const NODE_ENV: boolean =
  process.env.NODE_ENV === "production" ? true : false;

export const COOKIE_NAME = "qid";