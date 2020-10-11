import express from "express";
import userRoute from "./auth";
import productRoute from "./product";

const router = express.Router();

router.use("/auth", userRoute);
router.use("/product", productRoute);

export default router;
