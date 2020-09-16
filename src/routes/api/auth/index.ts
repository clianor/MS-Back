import express from "express";
import {registerService, loginService, meService} from "./index.service";

const router = express.Router();

/**
 * 회원가입
 */
router.post("/register", (req, res) => {
  registerService(req, res);
});

/**
 * 로그인
 */
router.post("/login", (req, res) => {
  loginService(req, res);
});

/**
 * 내정보
 */
router.post("/me", (req, res) => {
  meService(req, res);
})

export default router;
