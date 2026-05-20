import React, { useState, useEffect } from 'react';
import { getApiBaseUrl } from '@/app/config/apiConfig';
import PropTypes from 'prop-types';

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
  const [expandedItems, setExpandedItems] = useState(new Set());

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

  const toggleExpanded = (id) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const expandAll = () => {
    setExpandedItems(new Set(faqs.map(faq => faq.id)));
  };

  const collapseAll = () => {
    setExpandedItems(new Set());
  };

  const filteredFAQs = faqs.filter(faq => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      faq.question.toLowerCase().includes(searchLower) ||
      faq.answer.toLowerCase().includes(searchLower) ||
      faq.category_label.toLowerCase().includes(searchLower)
    );
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
      <div className={`text-center py-8 ${className}`}>
        <div className="text-gray-400 mb-2">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-gray-600">No FAQs found</p>
        {searchTerm && (
          <p className="text-sm text-gray-500 mt-1">
            Try adjusting your search terms
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search and controls */}
      {showSearch && (
        <div className="space-y-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <svg
              className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      )}

      {/* FAQ Items */}
      <div className="space-y-3">
        {groupByCategory ? (
          // Group FAQs by category_label (or category)
          Object.entries(
            displayFAQs.reduce((acc, faq) => {
              const key = faq.category_label || faq.category || 'General';
              acc[key] = acc[key] || [];
              acc[key].push(faq);
              return acc;
            }, {})
          ).map(([groupLabel, faqs]) => (
            <div key={groupLabel} className="">
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">{groupLabel}</h3>
                  <span className="text-sm text-gray-500">{faqs.length} pertanyaan</span>
                </div>

                <div className="space-y-3">
                  {faqs.map((faq) => (
                    <div key={faq.id} className="border border-gray-100 rounded-lg overflow-hidden transition-all duration-200">
                      <button
                        onClick={() => toggleExpanded(faq.id)}
                        className="w-full px-4 py-3 text-left bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 pr-4">
                            <h4 className="font-medium text-gray-900">{faq.question}</h4>
                          
                          </div>
                          <div className="flex items-center space-x-2">
                            <svg
                              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${expandedItems.has(faq.id) ? 'transform rotate-180' : ''}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </button>

                      {expandedItems.has(faq.id) && (
                        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                          <div className="prose prose-sm max-w-none">
                            <p className="text-gray-700 whitespace-pre-wrap">{faq.answer}</p>
                          </div>
                          <div className="mt-3 text-xs text-gray-500">
                            Last updated: {faq.updated_at ? new Date(faq.updated_at).toLocaleDateString() : ''}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          displayFAQs.map((faq) => (
            <div
              key={faq.id}
              className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-200"
            >
              <button
                onClick={() => toggleExpanded(faq.id)}
                className="w-full px-4 py-3 text-left bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 pr-4">
                    <h3 className="font-medium text-gray-900">{faq.question}</h3>
                    {faq.category_label && (
                      <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                        {faq.category_label}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                        expandedItems.has(faq.id) ? 'transform rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </button>
              
              {expandedItems.has(faq.id) && (
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap">{faq.answer}</p>
                  </div>
                  <div className="mt-3 text-xs text-gray-500">
                    Last updated: {new Date(faq.updated_at).toLocaleDateString()}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Show more indicator */}
      {maxItems && filteredFAQs.length > maxItems && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-600">
            Showing {maxItems} of {filteredFAQs.length} FAQs
          </p>
        </div>
      )}
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
