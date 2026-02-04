import { Prisma, PrismaClient } from '../generated/prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prismaClientOptions: Prisma.PrismaClientOptions | undefined =
  process.env.ACCELERATE_URL
    ? ({ accelerateUrl: process.env.ACCELERATE_URL } as Prisma.PrismaClientOptions)
    : undefined;

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient(prismaClientOptions);

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
