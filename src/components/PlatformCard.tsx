'use client';

import { useState } from 'react';
import { CldImage } from 'next-cloudinary';
import { Copy, Download, CheckCircle2, Sparkles, Crop } from 'lucide-react';
import { cn, copyToClipboard } from '@/lib/utils';
import { PLATFORM_CONFIGS } from '@/lib/transformations';

interface PlatformCardProps {
  platform: keyof typeof PLATFORM_CONFIGS;
  url: string;
  publicId: string;
  isGenFill?: boolean;
}

export default function PlatformCard({ platform, url, publicId, isGenFill }: PlatformCardProps) {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const config = PLATFORM_CONFIGS[platform];

  const handleCopy = async () => {
    await copyToClipboard(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const ext = platform === 'flipkart' || platform === 'amazon' ? 'jpg' : 'webp';
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `visualcraft_${platform}.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  // Determine display dimensions for the preview image
  const previewWidth = 300;
  const aspectRatio = config.width / config.height;
  const previewHeight = Math.round(previewWidth / aspectRatio);

  const [imgSrc, setImgSrc] = useState(url);

  // Sync state when props update
  if (imgSrc !== url && !imgSrc.startsWith('data:')) {
    setImgSrc(url);
  }

  return (
    <div className="bg-white border border-border rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-200 group">
      {/* Image preview */}
      <div
        className="relative bg-surface flex items-center justify-center overflow-hidden"
        style={{ height: Math.min(previewHeight, 200) }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgSrc}
          alt={`${config.displayName} preview`}
          className="object-contain w-full h-full p-1"
          loading="lazy"
          onError={() => {
            // Keep current url or fallback to clean neutral SVG placeholder
            if (imgSrc !== url) setImgSrc(url);
          }}
        />

        {/* Badges overlay */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isGenFill && (
            <span className="flex items-center gap-1 px-2 py-0.5 bg-blue text-white text-[10px] font-medium rounded-full">
              <Sparkles className="w-2.5 h-2.5" />
              AI Extended
            </span>
          )}
          <span className="flex items-center gap-1 px-2 py-0.5 bg-foreground/80 text-white text-[10px] font-medium rounded-full">
            <Crop className="w-2.5 h-2.5" />
            Smart Crop
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="p-3 space-y-2.5">
        {/* Platform name + dimensions */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base leading-none">{config.emoji}</span>
              <p className="text-sm font-semibold text-foreground">{config.displayName}</p>
            </div>
            <p className="text-xs text-muted mt-0.5">{config.description}</p>
          </div>
          <span className="flex-shrink-0 px-2 py-0.5 bg-surface border border-border text-xs text-muted rounded font-mono">
            {config.width}×{config.height}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            id={`copy-${platform}`}
            onClick={handleCopy}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium border rounded-md transition-all',
              copied
                ? 'border-green text-green bg-green-light'
                : 'border-border text-muted hover:text-foreground hover:border-border-focus'
            )}
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-3 h-3" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                Copy URL
              </>
            )}
          </button>
          <button
            id={`download-${platform}`}
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium bg-blue text-white rounded-md hover:bg-blue-hover transition-colors disabled:opacity-60"
          >
            <Download className={cn('w-3 h-3', isDownloading && 'animate-bounce')} />
            {isDownloading ? 'Saving...' : 'Download'}
          </button>
        </div>
      </div>
    </div>
  );
}
