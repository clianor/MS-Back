import {Router, Response} from "express";
import session from "express-session";
import morgan from "morgan";
import path from "path";
import cors from "cors";
import parser from 'body-parser';
import {COOKIE_NAME, NODE_ENV, ROOT_DIR} from "../conf/constans";

const handleCors = (router: Router): void => {
  router.use(cors({origin: true, credentials: true}));
};

const handleBodyRequestParsing = (router: Router) => {
  router.use(parser.urlencoded({extended: true}));
  router.use(parser.json());
};

const handleSession = (router: Router) => {
  const options = {
    name: COOKIE_NAME,
    saveUninitialized: false,
    secret: "ujkfshjkahsdfjkhasukfhlkasdfhks",
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 days
      httpOnly: true,
      sameSite: "none",
    },
  }
  // @ts-ignore
  router.use(session(options));
}

const logger = (router: Router) => {
  router.use(NODE_ENV ?
    morgan("combined", {
      skip: function (_, res: Response) {
        return res.statusCode < 400;
      },
      stream: require("file-stream-rotator").getStream({
        filename: path.join(ROOT_DIR, "/log/access_%DATE%.log"),
        frequency: "daily",
        verbose: false,
        date_format: "YYYYMMDD",
      }),
    }) : morgan("dev")
  );
};

export default [handleCors, handleBodyRequestParsing, handleSession, logger];
