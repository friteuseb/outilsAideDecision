import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ clientId: string }> }
) {
  try {
    const { clientId } = await params

    const client = await prisma.client.findFirst({
      where: {
        OR: [
          { id: clientId },
          { slug: clientId }
        ]
      },
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

    return NextResponse.json(client)
  } catch (error) {
    console.error('Error fetching client:', error)
    return NextResponse.json(
      { error: 'Failed to fetch client' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ clientId: string }> }
) {
  try {
    const { clientId } = await params
    const body = await request.json()

    const { nom, slug, logo, couleurPrimaire, couleurSecondaire, domaine, criteresScoring, statut } = body

    const client = await prisma.client.update({
      where: { id: clientId },
      data: {
        nom,
        slug,
        logo,
        couleurPrimaire,
        couleurSecondaire,
        domaine,
        criteresScoring,
        statut
      }
    })

    return NextResponse.json(client)
  } catch (error) {
    console.error('Error updating client:', error)
    return NextResponse.json(
      { error: 'Failed to update client' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ clientId: string }> }
) {
  try {
    const { clientId } = await params

    // Delete all related data first
    await prisma.project.deleteMany({
      where: { clientId }
    })

    await prisma.user.deleteMany({
      where: { clientId }
    })

    // Then delete the client
    await prisma.client.delete({
      where: { id: clientId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting client:', error)
    return NextResponse.json(
      { error: 'Failed to delete client' },
      { status: 500 }
    )
  }
}
