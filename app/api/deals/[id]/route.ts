import { NextRequest } from 'next/server';
import dbConnect from '@/lib/Mongodb';
import Deal from '@/models/deal';
import { createErrorResponse, createSuccessResponse } from '@/lib/Auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const deal = await Deal.findById(params.id);

    if (!deal) {
      return createErrorResponse('Deal not found', 404);
    }

    return createSuccessResponse({ deal });

  } catch (error: any) {
    console.error('Get deal error:', error);
    return createErrorResponse(
      error.message || 'Failed to fetch deal',
      500
    );
  }
}