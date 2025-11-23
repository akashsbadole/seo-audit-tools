import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    // Hash password (for future use)
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        // password: hashedPassword, // Add password field to schema if needed
        isPremium: false,
        usage: {
          create: {
            freeReportsUsed: 0,
            freeSearchesUsed: 0,
          }
        }
      },
      include: {
        usage: true
      }
    });

    // Create JWT token
    const token = jwt.sign(
      { 
        userId: newUser.id,
        email: newUser.email,
        isPremium: newUser.isPremium 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user data and token
    const userData = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      isPremium: newUser.isPremium
    };

    return NextResponse.json({
      user: userData,
      token
    });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}