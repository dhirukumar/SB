import { NextRequest } from 'next/server';
import dbConnect from '@/lib/Mongodb';
import User from '@/models/user';
import { generateToken, createErrorResponse, createSuccessResponse } from '@/lib/Auth';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { email, password } = body;

   
    if (!email || !password) {
      return createErrorResponse('Please provide email and password', 400);
    }

    
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return createErrorResponse('Invalid credentials', 401);
    }

  
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return createErrorResponse('Invalid credentials', 401);
    }

    
    const token = generateToken(user._id.toString());

    return createSuccessResponse({
      message: 'Login successful',
      token,
      user: user.toPublicJSON()
    });

  } catch (error: any) {
    console.error('Login error:', error);
    return createErrorResponse(
      error.message || 'Login failed',
      500
    );
  }
}