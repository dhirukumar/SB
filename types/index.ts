export interface User {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'verified' | 'admin';
    isVerified: boolean;
    company?: string;
    websiteUrl?: string;
    verificationStatus: 'pending' | 'approved' | 'rejected' | 'none';
    createdAt: string;
  }
  
  export interface Partner {
    name: string;
    logo?: string;
    website?: string;
  }
  
  export interface EligibilityConditions {
    requiresVerification: boolean;
    requirements: string[];
  }
  
  export interface Deal {
    _id: string;
    title: string;
    description: string;
    shortDescription: string;
    partner: Partner;
    category: 'cloud' | 'marketing' | 'analytics' | 'productivity' | 'development' | 'design' | 'communication' | 'finance' | 'legal' | 'hr';
    accessLevel: 'public' | 'locked';
    eligibilityConditions: EligibilityConditions;
    benefits: string[];
    discountValue: string;
    validUntil?: string;
    claimLimit?: number;
    claimCount: number;
    isActive: boolean;
    tags: string[];
    redemptionInstructions?: string;
    isAvailable: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Claim {
    _id: string;
    user: string | User;
    deal: string | Deal;
    status: 'pending' | 'approved' | 'rejected' | 'active' | 'expired';
    claimedAt: string;
    approvedAt?: string;
    expiresAt?: string;
    redemptionCode?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface AuthResponse {
    success: boolean;
    message: string;
    token: string;
    user: User;
  }