'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import api from '@/lib/api';
import { Deal } from '@/types';
import { useAuthStore } from '@/store/Authstore';

export default function DealDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    fetchDeal();
  }, [params.id]);

  const fetchDeal = async () => {
    try {
      const response = await api.get(`/deals/${params.id}`);
      setDeal(response.data.deal);
    } catch (error) {
      console.error('Error fetching deal:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/deals/' + params.id);
      return;
    }

    if (deal?.accessLevel === 'locked' && !user?.isVerified) {
      alert('This deal requires verification. Please get verified first.');
      router.push('/dashboard');
      return;
    }

    try {
      setClaiming(true);
      await api.post('/claims', { dealId: deal?._id });
      alert('Deal claimed successfully! Check your dashboard.');
      router.push('/dashboard');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error claiming deal');
    } finally {
      setClaiming(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="section-container pt-24">
          <div className="max-w-4xl mx-auto">
            <div className="skeleton h-96 rounded-2xl mb-8" />
            <div className="skeleton h-8 w-3/4 mb-4" />
            <div className="skeleton h-6 w-full mb-2" />
            <div className="skeleton h-6 w-full mb-2" />
            <div className="skeleton h-6 w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="section-container pt-24 text-center">
          <h1 className="text-4xl font-bold mb-4">Deal Not Found</h1>
          <Link href="/deals" className="btn-primary">
            Browse Deals
          </Link>
        </div>
      </div>
    );
  }

  const canAccess = deal.accessLevel === 'public' || (isAuthenticated && user?.isVerified);

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-12">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-5xl mx-auto"
          >
            <Link
              href="/deals"
              className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Deals
            </Link>

            <div className="glass rounded-3xl overflow-hidden">
              <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
                <div className="flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 mb-6 flex-wrap">
                    {deal.accessLevel === 'locked' ? (
                      <span className="px-3 py-1 bg-primary-500/20 border border-primary-500/30 rounded-full text-primary-400 text-sm font-medium">
                        🔒 Verified Only
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-sm font-medium">
                        ✓ Public Deal
                      </span>
                    )}
                    <span className="px-3 py-1 bg-slate-800 rounded-full text-sm font-medium capitalize">
                      {deal.category}
                    </span>
                  </div>

                  {deal.partner.logo && (
                    <div className="mb-6">
                      <Image
                        src={deal.partner.logo}
                        alt={deal.partner.name}
                        width={150}
                        height={150}
                        className="object-contain"
                      />
                    </div>
                  )}

                  <h1 className="font-display font-bold text-4xl md:text-5xl mb-4">
                    {deal.title}
                  </h1>

                  <p className="text-xl text-gray-300 mb-6">
                    {deal.shortDescription}
                  </p>

                  <div className="flex items-center gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Value</p>
                      <p className="text-2xl font-bold gradient-text">{deal.discountValue}</p>
                    </div>
                    <div className="h-12 w-px bg-white/10" />
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Partner</p>
                      <p className="text-xl font-semibold">{deal.partner.name}</p>
                    </div>
                  </div>

                  {deal.partner.website && (
                    <a
                      href={deal.partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-400 hover:text-primary-300 inline-flex items-center gap-2 mb-8"
                    >
                      Visit Partner Website
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}

                  {!canAccess ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-primary-500/10 border border-primary-500/20 rounded-lg">
                        <p className="text-sm font-medium mb-2">🔒 Verification Required</p>
                        <p className="text-sm text-gray-400">
                          This exclusive deal is only available for verified startups.
                        </p>
                      </div>
                      <Link href="/dashboard" className="btn-primary w-full block text-center">
                        Get Verified
                      </Link>
                    </div>
                  ) : (
                    <button
                      onClick={handleClaim}
                      disabled={claiming}
                      className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {claiming ? 'Claiming...' : 'Claim This Deal'}
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-center bg-gradient-to-br from-primary-500/10 to-accent-500/10 rounded-2xl p-12">
                  <div className="text-center">
                    <div className="text-8xl mb-4">🎁</div>
                    <p className="text-lg font-semibold">Exclusive Offer</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="md:col-span-2 space-y-6">
                <div className="card">
                  <h2 className="font-display font-semibold text-2xl mb-4">About This Deal</h2>
                  <p className="text-gray-300 leading-relaxed">{deal.description}</p>
                </div>

                <div className="card">
                  <h2 className="font-display font-semibold text-2xl mb-4">What You Get</h2>
                  <ul className="space-y-3">
                    {deal.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-300">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {deal.redemptionInstructions && (
                  <div className="card">
                    <h2 className="font-display font-semibold text-2xl mb-4">How to Redeem</h2>
                    <p className="text-gray-300">{deal.redemptionInstructions}</p>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="card">
                  <h3 className="font-display font-semibold text-xl mb-4">Eligibility</h3>
                  {deal.eligibilityConditions.requirements.length > 0 ? (
                    <ul className="space-y-2">
                      {deal.eligibilityConditions.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-400">
                          <span className="text-primary-400 mt-0.5">•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-400">Open to all startups</p>
                  )}
                </div>

                <div className="card">
                  <h3 className="font-display font-semibold text-xl mb-4">Deal Stats</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Claims</p>
                      <p className="text-2xl font-bold">{deal.claimCount}</p>
                    </div>
                    {deal.claimLimit && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Limit</p>
                        <p className="text-lg font-semibold">{deal.claimLimit} total</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Status</p>
                      <p className="text-lg font-semibold text-green-400">
                        {deal.isAvailable ? 'Available' : 'Unavailable'}
                      </p>
                    </div>
                  </div>
                </div>

                {deal.tags.length > 0 && (
                  <div className="card">
                    <h3 className="font-display font-semibold text-xl mb-4">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {deal.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-slate-800 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}