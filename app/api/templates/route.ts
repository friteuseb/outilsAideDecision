import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const templates = await prisma.template.findMany({
      include: {
        _count: {
          select: {
            projects: true
          }
        }
      },
      orderBy: {
        secteur: 'asc'
      }
    })

    return NextResponse.json(templates)
  } catch (error) {
    console.error('Error fetching templates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      titre,
      categorie,
      description,
      budget,
      delaiSemaines,
      kpi,
      scores,
      secteur,
      additionalInfo
    } = body

    const template = await prisma.template.create({
      data: {
        titre,
        categorie,
        description,
        budget,
        delaiSemaines,
        kpi,
        scores: scores || { impactBusiness: 5, complexite: 5 },
        secteur,
        additionalInfo
      }
    })

    return NextResponse.json(template)
  } catch (error) {
    console.error('Error creating template:', error)
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    )
  }
}
