import express from "express";
import userRoute from "./auth";

const router = express.Router();

router.use("/auth", userRoute);

export default router;
