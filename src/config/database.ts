import { PrismaClient } from '@prisma/client';

// Singleton do PrismaClient para evitar múltiplas conexões
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export default prisma;

