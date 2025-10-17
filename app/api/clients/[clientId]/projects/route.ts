import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ clientId: string }> }
) {
  try {
    const { clientId } = await params

    // First, try to find client by ID or slug
    const client = await prisma.client.findFirst({
      where: {
        OR: [
          { id: clientId },
          { slug: clientId }
        ]
      }
    })

    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      )
    }

    const projects = await prisma.project.findMany({
      where: {
        clientId: client.id
      },
      include: {
        template: true,
        createdBy: {
          select: {
            nom: true,
            prenom: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ clientId: string }> }
) {
  try {
    const { clientId } = await params
    const body = await request.json()

    const {
      titre,
      categorie,
      description,
      budget,
      delaiSemaines,
      kpi,
      scores,
      additionalInfo,
      templateId,
      createdById
    } = body

    const project = await prisma.project.create({
      data: {
        clientId,
        titre,
        categorie,
        description,
        budget,
        delaiSemaines,
        kpi,
        scores,
        additionalInfo,
        templateId,
        createdById
      }
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}
