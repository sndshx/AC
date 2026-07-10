import { NextRequest, NextResponse } from 'next/server'
import { getAllUsers, createUser, searchUsers } from '@/lib/shared/database-operations'
import { Role } from '@prisma/client'

// GET: सबै Users लिनुहोस् या Search गर्नुहोस्
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    let users
    if (query) {
      users = await searchUsers(query)
    } else {
      users = await getAllUsers()
    }

    return NextResponse.json({
      success: true,
      data: users
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

// POST: नयाँ User बनाउनुहोस्
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fullName, email, password, role, teamName } = body

    // Validation
    if (!fullName || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Password strength check
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    const user = await createUser({
      fullName,
      email,
      password,
      role: role as Role || Role.USER,
      teamName
    })

    // Password hash हटाएर response दिनुहोस्
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      data: userWithoutPassword,
      message: 'User created successfully'
    })
  } catch (error: unknown) {
    console.error('Error creating user:', error)
    
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: 'Email already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    )
  }
}