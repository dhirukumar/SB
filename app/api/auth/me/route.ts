import { NextRequest } from 'next/server';
import { verifyAuth, createErrorResponse, createSuccessResponse } from '@/lib/Auth';

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);

    if (!user) {
      return createErrorResponse('Not authorized', 401);
    }

    return createSuccessResponse({
      user: user.toPublicJSON()
    });

  } catch (error: any) {
    console.error('Get user error:', error);
    return createErrorResponse(
      error.message || 'Failed to get user',
      500
    );
  }
}