import express, {Router, Response} from "express";
import morgan from "morgan";
import path from "path";
import {NODE_ENV, ROOT_DIR} from "../conf/constans";

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

const initSetting = (router: Router) => {
  router.use(express.urlencoded({extended: true}));
  router.use(express.json());
};

export default [logger, initSetting];
