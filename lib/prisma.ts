import { PrismaClient } from '@prisma/client'

// Construire la DATABASE_URL à partir des variables Vercel-Supabase si nécessaire
function getDatabaseUrl(): string {
  // Si DATABASE_URL existe déjà, l'utiliser (développement local)
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL
  }

  // Sinon, construire à partir des variables Vercel
  const host = process.env.POSTGRES_HOST
  const user = process.env.POSTGRES_USER
  const password = process.env.POSTGRES_PASSWORD
  const database = process.env.POSTGRES_DATABASE

  if (!host || !user || !password || !database) {
    throw new Error(
      'Missing database configuration. Required: POSTGRES_HOST, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DATABASE'
    )
  }

  // Utiliser le port 6543 pour le connection pooling Supabase
  return `postgresql://${user}:${password}@${host}:6543/${database}?pgbouncer=true&connection_limit=1`
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: getDatabaseUrl()
      }
    }
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
