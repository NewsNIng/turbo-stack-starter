import NextAuth from "next-auth";

import { authOptions } from "@backend/server/auth/nextjs";

export default NextAuth(authOptions);
