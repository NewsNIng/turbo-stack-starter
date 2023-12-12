import type { PrismaClient } from "@database/models";
import type { Adapter, AdapterAccount, AdapterUser } from "next-auth/adapters";

export function NextAuthPrismaAdapter(p: PrismaClient): Adapter {
  return {
    // ---------------------- User Methods ----------------------
    async createUser(data: any): Promise<AdapterUser> {
      const user = await p.user.create({ data });
      return user as unknown as AdapterUser;
    },
    async getUser(id: any) {
      const user = await p.user.findUnique({ where: { id } });
      if (!user) {
        return null;
      }
      return user as unknown as AdapterUser;
    },
    async getUserByEmail(email) {
      // const user = await p.user.findUnique({ where: { email, domain } })
      const user = await p.user.findUnique({ where: { email } });

      if (!user) {
        return null;
      }
      return user as unknown as AdapterUser;
    },
    async getUserByAccount(
      provider_providerAccountId
    ): Promise<AdapterUser | null> {
      const account = await p.account.findUnique({
        where: { provider_providerAccountId },
        select: { user: true },
      });
      const user = account?.user;
      if (!user) {
        return null;
      }
      return user as unknown as AdapterUser;
    },
    async updateUser({ id, ...data }) {
      const user = await p.user.update({ where: { id }, data });
      return user as unknown as AdapterUser;
    },
    async deleteUser(id) {
      const user = await p.user.delete({ where: { id } });
      if (!user) {
        return null;
      }
      return user as unknown as AdapterUser;
    },
    //  ---------------------- Account Methods ----------------------
    linkAccount: (data) =>
      p.account.create({ data }) as unknown as AdapterAccount,
    unlinkAccount: (provider_providerAccountId) =>
      p.account.delete({
        where: { provider_providerAccountId },
      }) as unknown as AdapterAccount,
    async getSessionAndUser(sessionToken) {
      const userAndSession = await p.session.findUnique({
        where: { sessionToken },
        include: { user: true },
      });
      if (!userAndSession) {
        return null;
      }
      const { user, ...session } = userAndSession;
      return { user, session } as any;
    },
    createSession: (data) => p.session.create({ data }),
    updateSession: (data) =>
      p.session.update({ where: { sessionToken: data.sessionToken }, data }),
    deleteSession: (sessionToken) =>
      p.session.delete({ where: { sessionToken } }),
    async createVerificationToken(data) {
      const verificationToken = (await p.verificationToken.create({
        data,
      })) as any;

      // MongoDB needs an ID, but we don't
      if (verificationToken.id) {
        delete verificationToken.id;
      }
      return verificationToken;
    },
    async useVerificationToken(identifier_token) {
      try {
        const verificationToken = (await p.verificationToken.delete({
          where: { identifier_token },
        })) as any;

        // MongoDB needs an ID, but we don't
        if (verificationToken.id) {
          delete verificationToken.id;
        }
        return verificationToken;
      } catch (error) {
        // If token already used/deleted, just return null
        // https://www.prisma.io/docs/reference/api-reference/error-reference#p2025
        if ((error as any).code === "P2025") {
          return null;
        }
        throw error;
      }
    },
  };
}
