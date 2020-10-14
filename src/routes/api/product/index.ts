import express from "express";
import {productCreateService, productListService} from "./index.service";

const router = express.Router();

/**
 * 제품 등록
 */
router.post("/", (req, res) => {
  productCreateService(req, res);
});

/**
 * 제품 조회
 */
router.get("/", (req, res) => {
  productListService(req, res)
});

export default router;
