import express, {Response} from "express";
import apiRoute from "./api";

const router = express.Router();

router.get("/", (_, res: Response) => {
  res.status(200).send("마스의 API 서비스입니다.");
});

router.use("/api", apiRoute);

export default router;
