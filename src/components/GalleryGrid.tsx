'use client';

import { useState } from 'react';
import { CldImage } from 'next-cloudinary';
import { X, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PLATFORM_CONFIGS } from '@/lib/transformations';

interface CloudinaryResource {
  public_id: string;
  secure_url: string;
  tags: string[];
  created_at: string;
  width: number;
  height: number;
  bytes: number;
}

interface GalleryGridProps {
  resources: CloudinaryResource[];
  isLoading?: boolean;
}

export default function GalleryGrid({ resources, isLoading = false }: GalleryGridProps) {
  const [selectedResource, setSelectedResource] = useState<CloudinaryResource | null>(null);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square bg-surface rounded-xl animate-pulse border border-border"
          />
        ))}
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <div className="text-center py-20 text-muted">
        <div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center mx-auto mb-3">
          <span className="text-xl">📷</span>
        </div>
        <p className="text-sm font-medium text-foreground">No uploads yet</p>
        <p className="text-xs mt-1">Upload your first product photo to see it here</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {resources.map((resource) => (
          <button
            key={resource.public_id}
            onClick={() => setSelectedResource(resource)}
            className="group relative aspect-square bg-surface rounded-xl overflow-hidden border border-border hover:border-blue/50 hover:shadow-card-hover transition-all duration-200"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={resource.secure_url || `https://res.cloudinary.com/demo/image/upload/${resource.public_id}`}
              alt="Product photo"
              className="w-full h-full object-cover"
              loading="lazy"
            />

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-colors duration-200 flex items-center justify-center">
              <ExternalLink className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Tags */}
            {resource.tags?.length > 0 && (
              <div className="absolute bottom-1.5 left-1.5 right-1.5 flex flex-wrap gap-1">
                {resource.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="px-1.5 py-0.5 bg-foreground/70 text-white text-[9px] rounded truncate"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Modal */}
      {selectedResource && (
        <div
          className="fixed inset-0 z-50 bg-foreground/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedResource(null)}
        >
          <div
            className="bg-background rounded-2xl border border-border shadow-card-hover max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div>
                <p className="text-sm font-semibold text-foreground">Platform Variants</p>
                <p className="text-xs text-muted">{selectedResource.public_id}</p>
              </div>
              <button
                onClick={() => setSelectedResource(null)}
                className="p-1.5 rounded-lg hover:bg-surface text-muted hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Platform previews */}
            <div className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Object.entries(PLATFORM_CONFIGS).map(([key, config]) => (
                <div key={key} className="space-y-2">
                  <div className="aspect-square bg-surface rounded-lg overflow-hidden border border-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={selectedResource.secure_url || `https://res.cloudinary.com/demo/image/upload/${selectedResource.public_id}`}
                      alt={config.displayName}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">
                      {config.emoji} {config.displayName}
                    </p>
                    <p className="text-[10px] text-muted">
                      {config.width}×{config.height}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Tags */}
            {selectedResource.tags?.length > 0 && (
              <div className="px-5 pb-5">
                <div className="h-px bg-border mb-4" />
                <p className="text-xs text-muted mb-2">Tags</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedResource.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-blue-light text-blue text-xs rounded-full border border-blue/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
