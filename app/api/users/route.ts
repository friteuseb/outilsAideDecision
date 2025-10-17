import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        client: {
          select: {
            nom: true,
            slug: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, nom, prenom, role, clientId, password } = body

    // TODO: Hash password with bcrypt when auth is implemented
    const user = await prisma.user.create({
      data: {
        email,
        nom,
        prenom,
        role,
        clientId,
        password // Will be hashed later
      },
      include: {
        client: {
          select: {
            nom: true,
            slug: true
          }
        }
      }
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}
