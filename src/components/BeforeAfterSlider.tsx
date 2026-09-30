'use client';

import { useState, useRef, useCallback } from 'react';
import { CldImage } from 'next-cloudinary';
import { ArrowLeftRight } from 'lucide-react';

interface BeforeAfterSliderProps {
  publicId: string;
  originalUrl: string;
}

export default function BeforeAfterSlider({ publicId, originalUrl }: BeforeAfterSliderProps) {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const cloudName =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME !== 'your_cloud_name_here'
      ? process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
      : 'demo';

  const initialBgUrl =
    publicId && publicId !== 'sample' && originalUrl.includes('cloudinary')
      ? `https://res.cloudinary.com/${cloudName}/image/upload/e_background_removal/${publicId}`
      : originalUrl;

  const [bgRemovedUrl, setBgRemovedUrl] = useState(initialBgUrl);

  const updateSlider = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pos = ((clientX - rect.left) / rect.width) * 100;
    setSliderPos(Math.max(0, Math.min(100, pos)));
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) updateSlider(e.clientX);
    },
    [isDragging, updateSlider]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      updateSlider(e.touches[0].clientX);
    },
    [updateSlider]
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted uppercase tracking-wider">Before / After</p>
        <span className="text-xs text-subtle">Drag to compare</span>
      </div>

      <div
        ref={containerRef}
        className="relative h-[280px] w-full overflow-hidden rounded-xl border border-border bg-neutral-100 cursor-col-resize select-none"
        onMouseMove={handleMouseMove}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onTouchMove={handleTouchMove}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
      >
        {/* After (background removed / studio look) */}
        <div className="absolute inset-0 w-full h-full bg-white p-3 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={bgRemovedUrl}
            alt="Background removed"
            onError={() => {
              setBgRemovedUrl(originalUrl);
            }}
            className="max-h-full max-w-full object-contain filter contrast-[1.05]"
          />
        </div>

        {/* Before (original) — clipped on left via sliderPos */}
        <div
          className="absolute inset-y-0 left-0 overflow-hidden bg-neutral-100"
          style={{ width: `${sliderPos}%` }}
        >
          <div
            className="absolute inset-y-0 left-0 p-3 flex items-center justify-center"
            style={{
              width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
              height: '100%',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={originalUrl}
              alt="Original"
              className="max-h-full max-w-full object-contain"
            />
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-3 left-3 px-2 py-0.5 bg-foreground/75 text-white text-[10px] font-medium rounded shadow-sm z-10">
          Original
        </div>
        <div className="absolute top-3 right-3 px-2 py-0.5 bg-blue text-white text-[10px] font-medium rounded shadow-sm z-10">
          BG Removed
        </div>

        {/* Slider handle */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg pointer-events-none z-20"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-card-hover border border-border flex items-center justify-center">
            <ArrowLeftRight className="w-4 h-4 text-foreground" />
          </div>
        </div>
      </div>
    </div>
  );
}
