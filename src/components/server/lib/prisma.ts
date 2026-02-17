import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  // В Prisma 7 параметры берутся из prisma.config.ts автоматически
  return new PrismaClient()
}

declare const globalThis: {
  prisma: ReturnType<typeof prismaClientSingleton> | undefined;
} & typeof global;

export const prisma = globalThis.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
