import express, {Request, Response} from "express";
import {registerService} from "./index.service";

const router = express.Router();

/**
 * 유저 정보 얻기
 */
router.get("/", (req: Request, res: Response) => {
  res.send("user get");
});

/**
 * 회원가입
 */
router.post("/", (req: Request, res: Response) => {
  registerService(req, res);
});

export default router;
