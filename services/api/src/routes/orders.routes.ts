import { Router } from "express";
import { createOrder } from "../controllers/orders.controller";
import { asyncHandler } from "../lib/async-handler";

const router = Router();

router.post("/", asyncHandler(createOrder));

export default router;