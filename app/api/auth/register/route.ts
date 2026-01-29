import { NextRequest } from 'next/server';
import dbConnect from '@/lib/Mongodb';
import User from '@/models/user';
import { generateToken, createErrorResponse, createSuccessResponse } from '@/lib/Auth';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { name, email, password, company, websiteUrl } = body;

    
    if (!name || !email || !password) {
      return createErrorResponse('Please provide name, email and password', 400);
    }

   
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return createErrorResponse('Email already registered', 400);
    }

    
    const user = await User.create({
      name,
      email,
      password,
      company,
      websiteUrl
    });

    
    const token = generateToken(user._id.toString());

    return createSuccessResponse({
      message: 'User registered successfully',
      token,
      user: user.toPublicJSON()
    }, 201);

  } catch (error: any) {
    console.error('Registration error:', error);
    return createErrorResponse(
      error.message || 'Registration failed',
      500
    );
  }
}