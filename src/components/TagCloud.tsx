'use client';

import { Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TagCloudProps {
  tags: string[];
}

// High-confidence tags are assumed to be the first few in the list
const HIGH_CONFIDENCE_COUNT = 3;

export default function TagCloud({ tags }: TagCloudProps) {
  if (tags.length === 0) return null;

  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-1.5">
        <Tag className="w-3.5 h-3.5 text-blue" />
        <p className="text-xs font-medium text-muted uppercase tracking-wider">
          Detected by Cloudinary AI
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag, i) => {
          const isHighConfidence = i < HIGH_CONFIDENCE_COUNT;
          return (
            <span
              key={tag}
              className={cn(
                'px-2.5 py-1 rounded-full text-xs font-medium border transition-colors',
                isHighConfidence
                  ? 'bg-blue-light text-blue border-blue/20'
                  : 'bg-surface text-muted border-border'
              )}
            >
              {tag}
            </span>
          );
        })}
      </div>

      {tags.length > 0 && (
        <p className="text-[10px] text-subtle">
          {tags.length} tags detected · confidence ≥ 0.6
        </p>
      )}
    </div>
  );
}
