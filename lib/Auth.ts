import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import User, { IUser } from '@/models/user';
import dbConnect from '@/lib/Mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-this';

export interface AuthRequest extends NextRequest {
  user?: IUser;
}

export async function verifyAuth(request: NextRequest): Promise<IUser | null> {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    
    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    
    await dbConnect();
    const user = await User.findById(decoded.id).select('-password');
    
    return user;
  } catch (error) {
    return null;
  }
}

export function generateToken(userId: string): string {
    //@ts-ignore
  return jwt.sign(
    { id: userId },
    JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
}

export function createErrorResponse(message: string, status = 400) {
  return Response.json(
    { success: false, message },
    { status }
  );
}

export function createSuccessResponse(data: any, status = 200) {
  return Response.json(
    { success: true, ...data },
    { status }
  );
}