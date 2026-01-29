import { NextRequest } from 'next/server';
import dbConnect from '@/lib/Mongodb';
import Claim from '@/models/clam';
import Deal from '@/models/deal';
import { verifyAuth, createErrorResponse, createSuccessResponse } from '@/lib/Auth';

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);

    if (!user) {
      return createErrorResponse('Not authorized', 401);
    }

    await dbConnect();

    const body = await request.json();
    const { dealId } = body;

    if (!dealId) {
      return createErrorResponse('Deal ID is required', 400);
    }

    // Check if deal exists
    const deal = await Deal.findById(dealId);

    if (!deal) {
      return createErrorResponse('Deal not found', 404);
    }

    // Check if deal is active and available
    if (!deal.isActive) {
      return createErrorResponse('This deal is no longer active', 400);
    }

    if (!deal.isAvailable) {
      return createErrorResponse('This deal is no longer available', 400);
    }

    // Check verification requirement
    if (deal.accessLevel === 'locked' && deal.eligibilityConditions.requiresVerification) {
      if (!user.isVerified) {
        return createErrorResponse(
          'This deal requires verification. Please verify your account first.',
          403
        );
      }
    }

    // Check if already claimed
    const existingClaim = await Claim.findOne({ user: user._id, deal: dealId });

    if (existingClaim) {
      return createErrorResponse('You have already claimed this deal', 400);
    }

    // Create claim
    const claim = await Claim.create({
      user: user._id,
      deal: dealId,
      status: deal.accessLevel === 'locked' ? 'pending' : 'approved'
    });

    // Increment deal claim count
    await deal.incrementClaimCount();

    // Auto-approve public deals
    if (deal.accessLevel === 'public') {
      const redemptionCode = `DEAL-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      await claim.approve(redemptionCode);
    }

    // Populate claim
    await claim.populate('deal');

    return createSuccessResponse({
      message: deal.accessLevel === 'locked' 
        ? 'Claim submitted successfully. Pending approval.' 
        : 'Deal claimed successfully!',
      claim
    }, 201);

  } catch (error: any) {
    console.error('Claim deal error:', error);
    return createErrorResponse(
      error.message || 'Failed to claim deal',
      500
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);

    if (!user) {
      return createErrorResponse('Not authorized', 401);
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query: any = { user: user._id };

    if (status && status !== 'all') {
      query.status = status;
    }

    const claims = await Claim.find(query)
      .populate('deal')
      .sort({ claimedAt: -1 });

    return createSuccessResponse({
      count: claims.length,
      claims
    });

  } catch (error: any) {
    console.error('Get claims error:', error);
    return createErrorResponse(
      error.message || 'Failed to fetch claims',
      500
    );
  }
}