import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "shared";
import { authConfig } from "./auth.config";
import jwt from "jsonwebtoken";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma as any),
  session: { strategy: "jwt" },
  jwt: {
    encode: async ({ token, secret }) => {
      const activeSecret = Array.isArray(secret) ? secret[0] : secret;
      return jwt.sign(token!, activeSecret);
    },
    decode: async ({ token, secret }) => {
      const activeSecret = Array.isArray(secret) ? secret[0] : secret;
      return jwt.verify(token!, activeSecret) as any;
    },
  },
  ...authConfig,
});
