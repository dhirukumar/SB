import { NextRequest } from 'next/server';
import dbConnect from '@/lib/Mongodb';
import User from '@/models/user';
import { verifyAuth, createErrorResponse, createSuccessResponse } from '@/lib/Auth';

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);

    if (!user) {
      return createErrorResponse('Not authorized', 401);
    }

    await dbConnect();

    const body = await request.json();
    const { company, websiteUrl } = body;

    if (!company || !websiteUrl) {
      return createErrorResponse('Please provide company name and website URL', 400);
    }

    const updatedUser = await User.findById(user._id);
    
    if (!updatedUser) {
      return createErrorResponse('User not found', 404);
    }

    updatedUser.company = company;
    updatedUser.websiteUrl = websiteUrl;
    updatedUser.verificationStatus = 'pending';

    await updatedUser.save();

    return createSuccessResponse({
      message: 'Verification request submitted successfully',
      user: updatedUser.toPublicJSON()
    });

  } catch (error: any) {
    console.error('Verification request error:', error);
    return createErrorResponse(
      error.message || 'Failed to submit verification request',
      500
    );
  }
}