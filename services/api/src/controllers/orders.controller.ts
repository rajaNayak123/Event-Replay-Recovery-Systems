import { Request, Response } from "express";
import { z } from "zod";
import { orderService } from "../services/order.service";
import { verifyToken } from "../lib/auth";

const schema = z.object({
  tenantId: z.string().min(1),
  amount: z.number().positive(),
  currency: z.string().default("INR"),
  shouldFailInventory: z.boolean().optional(),
  idempotencyKey: z.string().optional()
});

export async function createOrder(req: Request, res: Response) {
  await verifyToken(req);
  const body = schema.parse(req.body);
  
  // Ensure idempotencyKey is passed from either body or headers
  const idempotencyKey = body.idempotencyKey || (req.headers["x-idempotency-key"] as string);

  const result = await orderService.createOrder({
    ...body,
    idempotencyKey
  });
  
  // Return 200 for idempotent duplicates, 201 for new creations
  const status = (result as any).isDuplicate ? 200 : 201;
  return res.status(status).json(result);
}