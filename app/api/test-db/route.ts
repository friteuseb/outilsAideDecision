import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  const diagnostics: any = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    variables: {
      POSTGRES_HOST: process.env.POSTGRES_HOST || 'not set',
      POSTGRES_USER: process.env.POSTGRES_USER || 'not set',
      POSTGRES_DATABASE: process.env.POSTGRES_DATABASE || 'not set',
      POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD ? 'set (hidden)' : 'not set',
      DATABASE_URL: process.env.DATABASE_URL ? 'set (hidden)' : 'not set',
    }
  }

  try {
    // Test 1: Connexion basique
    const clientCount = await prisma.client.count()
    diagnostics.test1 = {
      status: 'success',
      message: `Connexion réussie! ${clientCount} clients trouvés`
    }

    // Test 2: Récupérer les clients
    const clients = await prisma.client.findMany({
      select: {
        id: true,
        nom: true,
        slug: true,
        _count: {
          select: {
            users: true,
            projects: true
          }
        }
      }
    })

    diagnostics.test2 = {
      status: 'success',
      message: `${clients.length} clients récupérés`,
      data: clients
    }

    // Test 3: Compter les projets
    const projectCount = await prisma.project.count()
    diagnostics.test3 = {
      status: 'success',
      message: `${projectCount} projets trouvés`
    }

    return NextResponse.json({
      success: true,
      message: 'Tous les tests ont réussi!',
      diagnostics
    })

  } catch (error: any) {
    diagnostics.error = {
      status: 'error',
      message: error.message,
      code: error.code,
      name: error.name
    }

    return NextResponse.json({
      success: false,
      message: 'Erreur de connexion à la base de données',
      diagnostics
    }, { status: 500 })
  }
}
