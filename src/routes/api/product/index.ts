import express from "express";
import {productCreateService} from "./index.service";

const router = express.Router();

/**
 * 제품 등록
 */
router.post("/", (req, res) => {
  productCreateService(req, res);
});

export default router;
