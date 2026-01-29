import mongoose from 'mongoose';

export interface IDeal extends mongoose.Document {
  title: string;
  description: string;
  shortDescription: string;
  partner: {
    name: string;
    logo?: string;
    website?: string;
  };
  category: string;
  accessLevel: 'public' | 'locked';
  eligibilityConditions: {
    requiresVerification: boolean;
    requirements: string[];
  };
  benefits: string[];
  discountValue: string;
  validUntil?: Date;
  claimLimit?: number;
  claimCount: number;
  isActive: boolean;
  tags: string[];
  redemptionInstructions?: string;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
  incrementClaimCount(): Promise<IDeal>;
}

const dealSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Deal title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters long'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters long']
  },
  shortDescription: {
    type: String,
    required: true,
    trim: true,
    maxlength: [200, 'Short description cannot exceed 200 characters']
  },
  partner: {
    name: {
      type: String,
      required: [true, 'Partner name is required'],
      trim: true
    },
    logo: {
      type: String,
      trim: true
    },
    website: {
      type: String,
      trim: true
    }
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'cloud',
      'marketing',
      'analytics',
      'productivity',
      'development',
      'design',
      'communication',
      'finance',
      'legal',
      'hr'
    ]
  },
  accessLevel: {
    type: String,
    required: true,
    enum: ['public', 'locked'],
    default: 'public'
  },
  eligibilityConditions: {
    requiresVerification: {
      type: Boolean,
      default: false
    },
    requirements: [{
      type: String,
      trim: true
    }]
  },
  benefits: [{
    type: String,
    required: true,
    trim: true
  }],
  discountValue: {
    type: String,
    trim: true
  },
  validUntil: {
    type: Date
  },
  claimLimit: {
    type: Number,
    default: null
  },
  claimCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  redemptionInstructions: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

dealSchema.index({ category: 1 });
dealSchema.index({ accessLevel: 1 });
dealSchema.index({ isActive: 1 });
dealSchema.index({ createdAt: -1 });
dealSchema.index({ title: 'text', description: 'text', shortDescription: 'text' });

dealSchema.virtual('isAvailable').get(function() {
  if (!this.isActive) return false;
  if (this.validUntil && this.validUntil < new Date()) return false;
  if (this.claimLimit && this.claimCount >= this.claimLimit) return false;
  return true;
});

dealSchema.methods.incrementClaimCount = async function() {
  this.claimCount += 1;
  return await this.save();
};

dealSchema.set('toJSON', { virtuals: true });
dealSchema.set('toObject', { virtuals: true });

export default mongoose.models.Deal || mongoose.model<IDeal>('Deal', dealSchema);