import mongoose from 'mongoose';

export interface IClaim extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  deal: mongoose.Types.ObjectId;
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'expired';
  claimedAt: Date;
  approvedAt?: Date;
  expiresAt?: Date;
  redemptionCode?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  approve(redemptionCode: string, expirationDays?: number): Promise<IClaim>;
  reject(reason: string): Promise<IClaim>;
}

const claimSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  deal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Deal',
    required: [true, 'Deal reference is required']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'active', 'expired'],
    default: 'pending'
  },
  claimedAt: {
    type: Date,
    default: Date.now
  },
  approvedAt: {
    type: Date
  },
  expiresAt: {
    type: Date
  },
  redemptionCode: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

claimSchema.index({ user: 1, deal: 1 }, { unique: true });
claimSchema.index({ user: 1, status: 1 });
claimSchema.index({ deal: 1, status: 1 });
claimSchema.index({ claimedAt: -1 });

claimSchema.statics.hasUserClaimedDeal = async function(userId: string, dealId: string) {
  const claim = await this.findOne({ user: userId, deal: dealId });
  return !!claim;
};

claimSchema.methods.approve = async function(redemptionCode: string, expirationDays = 30) {
  this.status = 'approved';
  this.approvedAt = new Date();
  this.redemptionCode = redemptionCode;
  
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + expirationDays);
  this.expiresAt = expiryDate;
  
  return await this.save();
};

claimSchema.methods.reject = async function(reason: string) {
  this.status = 'rejected';
  this.notes = reason;
  return await this.save();
};

export default mongoose.models.Claim || mongoose.model<IClaim>('Claim', claimSchema);