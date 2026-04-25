import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "../../../generated/prisma";
import { authConfig } from "./auth.config";
import jwt from "jsonwebtoken";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma as any),
  session: { strategy: "jwt" },
  providers: [
    ...authConfig.providers,
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) return null;

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  jwt: {
    encode: async ({ token, secret, maxAge }) => {
      const activeSecret = Array.isArray(secret) ? secret[0] : secret;
      const { exp, iat, jti, ...rest } = token as any;

      return jwt.sign(rest, activeSecret, {
        expiresIn: maxAge ?? 60 * 60 * 24 * 30,
      });
    },
    decode: async ({ token, secret }) => {
      const activeSecret = Array.isArray(secret) ? secret[0] : secret;
      return jwt.verify(token!, activeSecret) as any;
    },
  },
});
