'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Loader2 } from 'lucide-react';
import GalleryGrid from '@/components/GalleryGrid';
import { cn } from '@/lib/utils';

const FILTER_TAGS = [
  { label: 'All', value: '' },
  { label: 'Clothing', value: 'clothing' },
  { label: 'Electronics', value: 'electronics' },
  { label: 'Accessories', value: 'accessories' },
  { label: 'Home', value: 'home' },
  { label: 'Food', value: 'food' },
];

interface CloudinaryResource {
  public_id: string;
  secure_url: string;
  tags: string[];
  created_at: string;
  width: number;
  height: number;
  bytes: number;
}

export default function GalleryPage() {
  const [resources, setResources] = useState<CloudinaryResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [total, setTotal] = useState(0);

  const fetchResources = useCallback(async (q: string) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        max_results: '24',
        ...(q ? { q } : {}),
      });
      const response = await fetch(`/api/search?${params}`);
      const data = await response.json();
      setResources(data.resources || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Gallery fetch failed:', err);
      setResources([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResources(activeFilter);
  }, [activeFilter, fetchResources]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchResources(searchQuery);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Gallery</h1>
        <p className="text-sm text-muted mt-1">
          All your processed product photos · Powered by Cloudinary Search API
        </p>
      </div>

      {/* Search + filter bar */}
      <div className="space-y-3 mb-6">
        {/* Search input */}
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
          <input
            id="gallery-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by product type, tag... e.g. kurta, earrings"
            className="input pl-9 pr-20"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-xs font-medium bg-blue text-white rounded-md hover:bg-blue-hover transition-colors"
          >
            Search
          </button>
        </form>

        {/* Filter pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-3.5 h-3.5 text-muted flex-shrink-0" />
          {FILTER_TAGS.map((tag) => (
            <button
              key={tag.value}
              id={`filter-${tag.label.toLowerCase()}`}
              onClick={() => {
                setActiveFilter(tag.value);
                setSearchQuery(tag.value);
              }}
              className={cn(
                'px-3 py-1 text-xs font-medium rounded-full border transition-all',
                activeFilter === tag.value
                  ? 'bg-blue text-white border-blue'
                  : 'border-border text-muted hover:text-foreground hover:border-border-focus'
              )}
            >
              {tag.label}
            </button>
          ))}

          {total > 0 && (
            <span className="ml-auto text-xs text-muted">
              {total} photo{total !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex items-center justify-center gap-2 py-4 text-muted">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Searching Cloudinary...</span>
        </div>
      )}

      {/* Gallery grid */}
      <GalleryGrid resources={resources} isLoading={isLoading} />
    </div>
  );
}
