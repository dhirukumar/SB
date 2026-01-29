'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import api from '@/lib/api';
import { Claim } from '@/types';
import { useAuthStore } from '@/store/Authstore';

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, user, updateUser } = useAuthStore();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved'>('all');
  const [verificationForm, setVerificationForm] = useState({
    company: user?.company || '',
    websiteUrl: user?.websiteUrl || '',
  });
  const [submittingVerification, setSubmittingVerification] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchClaims();
  }, [isAuthenticated]);

  const fetchClaims = async () => {
    try {
      const response = await api.get('/claims');
      setClaims(response.data.claims);
    } catch (error) {
      console.error('Error fetching claims:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingVerification(true);

    try {
      const response = await api.post('/auth/request-verification', verificationForm);
      updateUser(response.data.user);
      alert('Verification request submitted successfully!');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error submitting verification request');
    } finally {
      setSubmittingVerification(false);
    }
  };

  const filteredClaims = claims.filter((claim) => {
    if (activeTab === 'all') return true;
    return claim.status === activeTab;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'pending':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'rejected':
        return 'text-red-400 bg-red-500/10 border-red-500/20';
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-12">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h1 className="font-display font-bold text-4xl md:text-5xl mb-2">
              Welcome back, <span className="gradient-text">{user?.name}</span>
            </h1>
            <p className="text-gray-400 text-lg">Manage your claimed deals and account</p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="card"
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="font-display font-semibold text-2xl mb-2">Profile</h2>
                    <p className="text-gray-400">Your account information</p>
                  </div>
                  {user?.isVerified && (
                    <span className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-sm font-medium flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Verified
                    </span>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Email</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Member Since</p>
                    <p className="font-medium">
                      {new Date(user?.createdAt || '').toLocaleDateString()}
                    </p>
                  </div>
                  {user?.company && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Company</p>
                      <p className="font-medium">{user.company}</p>
                    </div>
                  )}
                  {user?.websiteUrl && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Website</p>
                      <a
                        href={user.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-primary-400 hover:text-primary-300"
                      >
                        {user.websiteUrl.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="card"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="font-display font-semibold text-2xl mb-2">My Deals</h2>
                    <p className="text-gray-400">Track your claimed deals</p>
                  </div>
                  <Link href="/deals" className="btn-primary text-sm">
                    Browse Deals
                  </Link>
                </div>

                <div className="flex gap-2 mb-6 border-b border-white/10">
                  {(['all', 'pending', 'approved'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 font-medium transition-colors capitalize ${
                        activeTab === tab
                          ? 'text-primary-400 border-b-2 border-primary-400'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="skeleton h-24 rounded-lg" />
                    ))}
                  </div>
                ) : filteredClaims.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📦</div>
                    <h3 className="font-semibold text-xl mb-2">No claims yet</h3>
                    <p className="text-gray-400 mb-6">Start claiming deals to see them here</p>
                    <Link href="/deals" className="btn-outline">
                      Browse Deals
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredClaims.map((claim) => {
                      const deal = typeof claim.deal === 'object' ? claim.deal : null;
                      if (!deal) return null;

                      return (
                        <div
                          key={claim._id}
                          className="p-4 bg-slate-800/50 rounded-lg border border-white/10 hover:border-primary-500/30 transition-all"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg mb-1">{deal.title}</h3>
                              <p className="text-sm text-gray-400">{deal.partner.name}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(claim.status)}`}>
                              {claim.status}
                            </span>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-400 flex-wrap">
                            <span>Claimed: {new Date(claim.claimedAt).toLocaleDateString()}</span>
                            {claim.redemptionCode && (
                              <span className="text-primary-400 font-mono">
                                Code: {claim.redemptionCode}
                              </span>
                            )}
                          </div>

                          {claim.status === 'approved' && claim.redemptionCode && (
                            <div className="mt-3 pt-3 border-t border-white/10">
                              <p className="text-sm text-green-400 mb-2">✓ Ready to use!</p>
                              <p className="text-xs text-gray-400">
                                {deal.redemptionInstructions || 'Check deal details for redemption instructions'}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            </div>

            <div className="space-y-8">
              {!user?.isVerified && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="card"
                >
                  <div className="text-center mb-6">
                    <div className="text-5xl mb-3">🔓</div>
                    <h3 className="font-display font-semibold text-xl mb-2">
                      Get Verified
                    </h3>
                    <p className="text-sm text-gray-400">
                      Unlock exclusive locked deals for verified startups
                    </p>
                  </div>

                  {user?.verificationStatus === 'pending' ? (
                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-center">
                      <p className="text-sm text-yellow-400 font-medium">
                        ⏳ Verification Pending
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        We're reviewing your application
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleVerificationSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Company Name
                        </label>
                        <input
                          type="text"
                          value={verificationForm.company}
                          onChange={(e) =>
                            setVerificationForm({ ...verificationForm, company: e.target.value })
                          }
                          required
                          className="input-field"
                          placeholder="Your Startup Inc."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Website URL
                        </label>
                        <input
                          type="url"
                          value={verificationForm.websiteUrl}
                          onChange={(e) =>
                            setVerificationForm({ ...verificationForm, websiteUrl: e.target.value })
                          }
                          required
                          className="input-field"
                          placeholder="https://yourstartup.com"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={submittingVerification}
                        className="btn-primary w-full text-sm disabled:opacity-50"
                      >
                        {submittingVerification ? 'Submitting...' : 'Request Verification'}
                      </button>
                    </form>
                  )}
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="card"
              >
                <h3 className="font-display font-semibold text-xl mb-6">Your Stats</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Claims</p>
                    <p className="text-3xl font-bold gradient-text">{claims.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Approved</p>
                    <p className="text-2xl font-semibold text-green-400">
                      {claims.filter((c) => c.status === 'approved').length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Pending</p>
                    <p className="text-2xl font-semibold text-yellow-400">
                      {claims.filter((c) => c.status === 'pending').length}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}