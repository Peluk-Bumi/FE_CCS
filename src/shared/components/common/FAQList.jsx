import React, { useState, useEffect } from 'react';
import { getApiBaseUrl } from '@/app/config/apiConfig';
import PropTypes from 'prop-types';
import { Accordion } from '@/shared/components/ui/accordion';
import { Input } from '@/shared/components/ui/input';
import { FiSearch, FiMessageCircle, FiGrid, FiFolder } from 'react-icons/fi';
import { cn } from '@/shared/utils/utils';
import { SidebarTabs } from '@/shared/components/ui/tabs';

const FAQList = ({ 
  category = null, 
  projectStatus = null, 
  maxItems = null,
  showSearch = true,
  groupByCategory = false,
  className = '',
}) => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    fetchFAQs();
  }, [category, projectStatus]);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      setError(null);

      // Primary: try backend API (use configured API base URL)
      const base = getApiBaseUrl();
      let url = base ? `${base}/faqs` : '/api/faqs';
      const params = new URLSearchParams();

      if (category) {
        params.append('category', category);
      }

      if (projectStatus) {
        params.append('project_status', projectStatus);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      let response;
      try {
        response = await fetch(url);
      } catch (err) {
        response = null;
      }

      // If backend failed, try static fallback shipped with frontend
      if (!response || !response.ok) {
        // attempt static JSON fallback
        try {
          response = await fetch('/api/faqs.json');
        } catch (err) {
          response = null;
        }
      }

      if (!response || !response.ok) {
        throw new Error('Failed to fetch FAQs');
      }

      const data = await response.json();
      setFaqs(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Derive categories from faqs
  const uniqueCategories = Array.from(new Set(faqs.map(faq => faq.category_label || faq.category || 'General')));
  const categoryTabs = [
    { key: 'all', label: 'Semua Topik', icon: FiGrid, count: faqs.length },
    ...uniqueCategories.map(c => ({
      key: c,
      label: c,
      icon: FiFolder,
      count: faqs.filter(faq => (faq.category_label || faq.category || 'General') === c).length
    }))
  ];

  const filteredFAQs = faqs.filter(faq => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || (
      faq.question.toLowerCase().includes(searchLower) ||
      faq.answer.toLowerCase().includes(searchLower) ||
      (faq.category_label || '').toLowerCase().includes(searchLower)
    );
    
    const cat = faq.category_label || faq.category || 'General';
    const matchesCategory = activeCategory === 'all' || cat === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  const displayFAQs = maxItems && !groupByCategory ? filteredFAQs.slice(0, maxItems) : filteredFAQs;

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(3)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="text-red-500 mb-2">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-gray-600">Failed to load FAQs</p>
        <button
          onClick={fetchFAQs}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (displayFAQs.length === 0) {
    return (
      <div className={cn("grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start", className)}>
        {/* Sidebar: Search & Support Info */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
          {showSearch && (
            <div className="bg-white dark:bg-gray-800/40 p-4 sm:p-5 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Cari Topik</h3>
              <Input
                type="text"
                placeholder="Ketik kata kunci pencarian..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                prefix={<FiSearch className="w-5 h-5 text-gray-400" />}
                className="w-full bg-gray-50 dark:bg-gray-900/50"
              />
            </div>
          )}
          {categoryTabs.length > 1 && (
            <div className="bg-white dark:bg-gray-800/40 p-2 sm:p-3 md:p-5 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm">
              <h3 className="hidden md:block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 px-2">Kategori</h3>
              <SidebarTabs
                tabs={categoryTabs}
                activeTab={activeCategory}
                onTabChange={setActiveCategory}
              />
            </div>
          )}
        </div>
        <div className="lg:col-span-8 flex flex-col items-center justify-center py-12">
          <div className="text-gray-400 mb-2">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-600">Tidak ada pertanyaan yang ditemukan</p>
          {searchTerm && (
            <p className="text-sm text-gray-500 mt-1">Coba sesuaikan kata kunci pencarian Anda</p>
          )}
        </div>
      </div>
    );
  }

  const shouldGroup = groupByCategory && activeCategory === 'all';

  return (
    <div className={cn("grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start", className)}>
      {/* Sidebar: Search & Support Info */}
      <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
        {showSearch && (
          <div className="bg-white dark:bg-gray-800/40 p-4 sm:p-5 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Cari Topik</h3>
            <Input
              type="text"
              placeholder="Ketik kata kunci pencarian..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              prefix={<FiSearch className="w-5 h-5 text-gray-400" />}
              className="w-full bg-gray-50 dark:bg-gray-900/50"
            />
            {searchTerm && (
              <p className="text-xs text-gray-500 mt-3 font-medium">
                Menemukan {filteredFAQs.length} hasil untuk "{searchTerm}"
              </p>
            )}
          </div>
        )}

        {/* Category Tabs */}
        {categoryTabs.length > 1 && (
          <div className="bg-white dark:bg-gray-800/40 p-2 sm:p-3 md:p-5 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm">
            <h3 className="hidden md:block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 px-2">Kategori</h3>
            <SidebarTabs
              tabs={categoryTabs}
              activeTab={activeCategory}
              onTabChange={setActiveCategory}
            />
          </div>
        )}

        {/* Support Info Box - visible only on desktop */}
        <div className="hidden lg:block bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 p-5 sm:p-6 rounded-2xl border border-primary/10 dark:border-primary/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-primary/10 dark:bg-primary/20 rounded-xl text-primary dark:text-primary-light">
              <FiMessageCircle className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-gray-900 dark:text-gray-100">Butuh Bantuan Lain?</h4>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-5 leading-relaxed">
            Jika Anda tidak menemukan jawaban yang Anda cari di sini, tim support kami siap membantu Anda secara langsung.
          </p>
          <button className="w-full py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-semibold transition-all shadow-sm shadow-primary/20">
            Hubungi Support
          </button>
        </div>
      </div>

      {/* Main Content: FAQ Accordions */}
      <div className="lg:col-span-8 space-y-6">
        {shouldGroup ? (
          // Group FAQs by category_label (or category)
          Object.entries(
            displayFAQs.reduce((acc, faq) => {
              const key = faq.category_label || faq.category || 'General';
              acc[key] = acc[key] || [];
              acc[key].push(faq);
              return acc;
            }, {})
          ).map(([groupLabel, faqs], index) => (
            <div key={groupLabel} className={index > 0 ? "pt-8 mt-2 border-t border-gray-100 dark:border-gray-800" : ""}>
              <div className="flex items-center gap-3 mb-5">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{groupLabel}</h3>
                <span className="text-xs font-bold px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
                  {faqs.length} pertanyaan
                </span>
              </div>

              <div className="space-y-3">
                {faqs.map((faq) => (
                  <Accordion key={faq.id} title={faq.question} className="border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{faq.answer}</p>
                    </div>
                    {faq.updated_at && (
                      <div className="mt-3 text-xs text-gray-400 dark:text-gray-500 font-medium">
                        Terakhir diperbarui: {new Date(faq.updated_at).toLocaleDateString()}
                      </div>
                    )}
                  </Accordion>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="space-y-3">
            {activeCategory !== 'all' && (
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{activeCategory}</h3>
                <span className="text-xs font-bold px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
                  {displayFAQs.length} pertanyaan
                </span>
              </div>
            )}
            {displayFAQs.map((faq) => (
              <Accordion key={faq.id} title={faq.question} className="border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
                {faq.category_label && activeCategory === 'all' && (
                  <div className="mb-3">
                    <span className="inline-block px-2.5 py-1 text-xs font-bold bg-primary/10 text-primary rounded-full">
                      {faq.category_label}
                    </span>
                  </div>
                )}
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{faq.answer}</p>
                </div>
                {faq.updated_at && (
                  <div className="mt-3 text-xs text-gray-400 dark:text-gray-500 font-medium">
                    Terakhir diperbarui: {new Date(faq.updated_at).toLocaleDateString()}
                  </div>
                )}
              </Accordion>
            ))}
          </div>
        )}

        {/* Show more indicator */}
        {maxItems && filteredFAQs.length > maxItems && (
          <div className="text-center pt-6 pb-2">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Menampilkan {maxItems} dari {filteredFAQs.length} pertanyaan
            </p>
          </div>
        )}

        {/* Support Info Box - visible only on mobile (bottom of list) */}
        <div className="block lg:hidden bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 p-5 sm:p-6 rounded-2xl border border-primary/10 dark:border-primary/20 mt-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-primary/10 dark:bg-primary/20 rounded-xl text-primary dark:text-primary-light">
              <FiMessageCircle className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-gray-900 dark:text-gray-100">Butuh Bantuan Lain?</h4>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-5 leading-relaxed">
            Jika Anda tidak menemukan jawaban yang Anda cari di sini, tim support kami siap membantu Anda secara langsung.
          </p>
          <button className="w-full py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-semibold transition-all shadow-sm shadow-primary/20">
            Hubungi Support
          </button>
        </div>
      </div>
    </div>
  );
};

FAQList.propTypes = {
  category: PropTypes.string,
  projectStatus: PropTypes.string,
  maxItems: PropTypes.number,
  showSearch: PropTypes.bool,
  groupByCategory: PropTypes.bool,
  className: PropTypes.string,
};

export default FAQList;
