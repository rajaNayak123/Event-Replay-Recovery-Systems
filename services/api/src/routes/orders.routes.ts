import { Router } from "express";
import { createOrder } from "../controllers/orders.controller";
import { asyncHandler } from "../lib/async-handler";
import { authMiddleware } from "../lib/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.post("/", asyncHandler(createOrder));

export default router;