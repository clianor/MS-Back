import express from "express";
import {registerService, loginService, meService, logoutService} from "./index.service";

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
 * 로그아웃
 */
router.get("/logout", (req, res) => {
  logoutService(req, res);
});

/**
 * 내정보
 */
router.post("/me", (req, res) => {
  meService(req, res);
});

export default router;
