import { PrismaClient } from '@prisma/client';

let prisma = new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  // @ts-ignore
  if (!global.prisma) {
    // @ts-ignore
    global.prisma = prisma;
  }
}

export default prisma;
