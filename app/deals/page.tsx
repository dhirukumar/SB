'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import api from '@/lib/api';
import { Deal } from '@/types';
import { useAuthStore } from '@/store/Authstore';

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [accessLevelFilter, setAccessLevelFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const { isAuthenticated, user } = useAuthStore();

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'cloud', label: 'Cloud' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'productivity', label: 'Productivity' },
    { value: 'development', label: 'Development' },
    { value: 'design', label: 'Design' },
    { value: 'communication', label: 'Communication' },
    { value: 'finance', label: 'Finance' },
  ];

  useEffect(() => {
    fetchDeals();
  }, [categoryFilter, accessLevelFilter, searchQuery, sortBy]);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (categoryFilter !== 'all') params.append('category', categoryFilter);
      if (accessLevelFilter !== 'all') params.append('accessLevel', accessLevelFilter);
      if (searchQuery) params.append('search', searchQuery);
      if (sortBy) params.append('sort', sortBy);

      const response = await api.get(`/deals?${params.toString()}`);
      setDeals(response.data.deals);
    } catch (error) {
      console.error('Error fetching deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const canAccessDeal = (deal: Deal) => {
    if (deal.accessLevel === 'public') return true;
    if (!isAuthenticated) return false;
    return user?.isVerified || false;
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-12">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="font-display font-bold text-5xl md:text-6xl mb-4">
              Explore <span className="gradient-text">Exclusive Deals</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Discover premium SaaS tools at unbeatable prices
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass rounded-2xl p-6 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-2">
                <input
                  type="text"
                  placeholder="Search deals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field w-full"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="input-field"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>

              <select
                value={accessLevelFilter}
                onChange={(e) => setAccessLevelFilter(e.target.value)}
                className="input-field"
              >
                <option value="all">All Deals</option>
                <option value="public">Public</option>
                <option value="locked">Verified Only</option>
              </select>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-400">
                {deals.length} deal{deals.length !== 1 ? 's' : ''} found
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field w-auto"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="card">
                  <div className="skeleton h-48 rounded-lg mb-4" />
                  <div className="skeleton h-6 w-3/4 mb-2" />
                  <div className="skeleton h-4 w-full mb-4" />
                  <div className="skeleton h-10 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${categoryFilter}-${accessLevelFilter}-${searchQuery}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {deals.map((deal, index) => {
                  const isLocked = deal.accessLevel === 'locked' && !canAccessDeal(deal);

                  return (
                    <motion.div
                      key={deal._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      className="card card-hover group relative overflow-hidden"
                    >
                      {isLocked && (
                        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-10 flex items-center justify-center">
                          <div className="text-center p-6">
                            <div className="text-5xl mb-3">🔒</div>
                            <p className="font-semibold mb-2">Verification Required</p>
                            <p className="text-sm text-gray-400 mb-4">
                              This deal is available for verified startups only
                            </p>
                            <Link href="/dashboard" className="btn-primary text-sm">
                              Get Verified
                            </Link>
                          </div>
                        </div>
                      )}

                      <div className="relative h-48 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                        {deal.partner.logo ? (
                          <Image
                            src={deal.partner.logo}
                            alt={deal.partner.name}
                            width={120}
                            height={120}
                            className="object-contain"
                          />
                        ) : (
                          <div className="text-6xl">{deal.title.charAt(0)}</div>
                        )}
                        
                        <div className="absolute top-3 right-3">
                          {deal.accessLevel === 'locked' ? (
                            <span className="px-3 py-1 bg-primary-500/20 border border-primary-500/30 rounded-full text-primary-400 text-xs font-medium">
                              🔒 Verified
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-xs font-medium">
                              ✓ Public
                            </span>
                          )}
                        </div>

                        <div className="absolute bottom-3 left-3">
                          <span className="px-3 py-1 bg-slate-900/80 backdrop-blur-sm rounded-full text-xs font-medium capitalize">
                            {deal.category}
                          </span>
                        </div>
                      </div>

                      <h3 className="font-display font-semibold text-xl mb-2 group-hover:text-primary-400 transition-colors">
                        {deal.title}
                      </h3>
                      
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {deal.shortDescription}
                      </p>

                      <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Value</p>
                          <p className="font-semibold text-primary-400">{deal.discountValue}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500 mb-1">Partner</p>
                          <p className="font-semibold text-sm">{deal.partner.name}</p>
                        </div>
                      </div>

                      <Link
                        href={`/deals/${deal._id}`}
                        className="btn-primary w-full text-center block"
                      >
                        View Details
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          )}

          {!loading && deals.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="font-display font-semibold text-2xl mb-2">No deals found</h3>
              <p className="text-gray-400 mb-6">Try adjusting your filters or search query</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('all');
                  setAccessLevelFilter('all');
                }}
                className="btn-outline"
              >
                Clear Filters
              </button>
            </motion.div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}