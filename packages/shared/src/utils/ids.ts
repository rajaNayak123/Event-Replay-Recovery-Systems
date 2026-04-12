import { v7 as uuidv7 } from "uuid";

export const generateEventId = () => uuidv7();
export const generateOrderNumber = () =>
  `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;