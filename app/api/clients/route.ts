import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    // If slug is provided, return only that client (as an array for consistency)
    if (slug) {
      const client = await prisma.client.findUnique({
        where: { slug },
        include: {
          _count: {
            select: {
              users: true,
              projects: true,
            }
          }
        }
      })

      if (!client) {
        return NextResponse.json(
          { error: 'Client not found' },
          { status: 404 }
        )
      }

      return NextResponse.json([client])
    }

    // Otherwise return all clients
    const clients = await prisma.client.findMany({
      include: {
        _count: {
          select: {
            users: true,
            projects: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(clients)
  } catch (error) {
    console.error('Error fetching clients:', error)
    return NextResponse.json(
      { error: 'Failed to fetch clients' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nom, slug, logo, couleurPrimaire, couleurSecondaire, domaine, criteresScoring } = body

    const client = await prisma.client.create({
      data: {
        nom,
        slug,
        logo,
        couleurPrimaire: couleurPrimaire || '#3B82F6',
        couleurSecondaire: couleurSecondaire || '#1E40AF',
        domaine,
        criteresScoring: criteresScoring || undefined,
      }
    })

    return NextResponse.json(client)
  } catch (error) {
    console.error('Error creating client:', error)
    return NextResponse.json(
      { error: 'Failed to create client' },
      { status: 500 }
    )
  }
}
