import { NextRequest } from 'next/server';
import dbConnect from '@/lib/Mongodb';
import Deal from '@/models/deal';
import { verifyAuth, createErrorResponse, createSuccessResponse } from '@/lib/Auth';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const accessLevel = searchParams.get('accessLevel');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort');

    // Build query
    let query: any = { isActive: true };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (accessLevel && accessLevel !== 'all') {
      query.accessLevel = accessLevel;
    }

    if (search) {
      query.$text = { $search: search };
    }

    // Execute query
    let dealsQuery = Deal.find(query);

    // Sort
    if (sort === 'newest') {
      dealsQuery = dealsQuery.sort({ createdAt: -1 });
    } else if (sort === 'oldest') {
      dealsQuery = dealsQuery.sort({ createdAt: 1 });
    } else if (sort === 'popular') {
      dealsQuery = dealsQuery.sort({ claimCount: -1 });
    } else {
      dealsQuery = dealsQuery.sort({ createdAt: -1 });
    }

    const deals = await dealsQuery;

    return createSuccessResponse({
      count: deals.length,
      deals
    });

  } catch (error: any) {
    console.error('Get deals error:', error);
    return createErrorResponse(
      error.message || 'Failed to fetch deals',
      500
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);

    if (!user || user.role !== 'admin') {
      return createErrorResponse('Not authorized', 403);
    }

    await dbConnect();

    const body = await request.json();
    const deal = await Deal.create(body);

    return createSuccessResponse({
      message: 'Deal created successfully',
      deal
    }, 201);

  } catch (error: any) {
    console.error('Create deal error:', error);
    return createErrorResponse(
      error.message || 'Failed to create deal',
      500
    );
  }
}