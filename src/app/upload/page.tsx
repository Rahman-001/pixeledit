'use client';

import { useState, useCallback } from 'react';
import UploadZone from '@/components/UploadZone';
import PipelineProgress from '@/components/PipelineProgress';
import PlatformCard from '@/components/PlatformCard';
import BackgroundPicker from '@/components/BackgroundPicker';
import CaptionPanel from '@/components/CaptionPanel';
import TagCloud from '@/components/TagCloud';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';
import DownloadAllButton from '@/components/DownloadAllButton';
import { getOrCreateSessionId } from '@/lib/utils';
import { PLATFORM_CONFIGS } from '@/lib/transformations';
import { AlertCircle } from 'lucide-react';

interface ProcessResult {
  platforms: Record<string, string>;
  tags: string[];
  captions: {
    instagram: string[];
    whatsapp: string[];
    flipkart: string[];
    facebook: string[];
  };
  originalUrl: string;
  processingTime: number;
}

export default function UploadPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [timing, setTiming] = useState<Record<number, number>>({});
  const [result, setResult] = useState<ProcessResult | null>(null);
  const [uploadedPublicId, setUploadedPublicId] = useState<string>('');
  const [uploadedOriginalUrl, setUploadedOriginalUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const recordTiming = (step: number, ms: number) => {
    setTiming((prev) => ({ ...prev, [step]: ms }));
  };

  const handleUploadSuccess = useCallback(
    async (file: { publicId: string; secureUrl: string }) => {
      setError(null);
      setResult(null);
      setUploadedPublicId(file.publicId);
      setUploadedOriginalUrl(file.secureUrl);
      setCurrentStep(1);

      const stepStart = (step: number) => {
        setCurrentStep(step);
        return Date.now();
      };

      try {
        // Step 1: Uploading — already done via widget
        const t1 = Date.now();
        recordTiming(1, 500); // widget already uploaded

        // Step 2: BG removal is part of transformation — simulate timing
        stepStart(2);
        await new Promise((r) => setTimeout(r, 600));
        recordTiming(2, 600);

        // Step 3: Auto-tag fetch (happens in /api/process)
        stepStart(3);
        const t3 = Date.now();

        // Step 4: Generate all platform variants
        stepStart(4);

        const sessionId = getOrCreateSessionId();
        const response = await fetch('/api/process', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            publicId: file.publicId,
            sessionId,
            originalUrl: file.secureUrl,
          }),
        });

        if (!response.ok) throw new Error('Processing failed');

        const data = await response.json();
        recordTiming(3, Date.now() - t3);
        recordTiming(4, 800);

        // Step 5: Captions (included in process response)
        stepStart(5);
        await new Promise((r) => setTimeout(r, 400));
        recordTiming(5, 400);

        setResult(data);
        setCurrentStep(6); // done
      } catch (err) {
        setError('Processing failed. Please check your Cloudinary credentials and try again.');
        setCurrentStep(0);
        console.error(err);
      }
    },
    []
  );

  const isProcessing = currentStep > 0 && currentStep <= 5;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Upload & Process</h1>
        <p className="text-sm text-muted mt-1">
          Upload a product photo · AI generates 6 platform-ready images
        </p>
      </div>

      <div className="grid lg:grid-cols-[420px,1fr] gap-6">
        {/* ===================== LEFT PANEL ===================== */}
        <div className="space-y-4">
          {/* Upload zone */}
          <div className="card p-4">
            <UploadZone
              onUploadSuccess={handleUploadSuccess}
              isProcessing={isProcessing}
            />
          </div>

          {/* Pipeline progress */}
          <PipelineProgress currentStep={currentStep} timing={timing} />

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 px-3 py-2.5 bg-red-light border border-red/20 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red">{error}</p>
            </div>
          )}

          {/* Tag cloud */}
          {result && result.tags.length > 0 && (
            <div className="card p-4">
              <TagCloud tags={result.tags} />
            </div>
          )}

          {/* Background picker */}
          {result && (
            <div className="card p-4">
              <BackgroundPicker
                publicId={uploadedPublicId}
                onResult={(url, presetId) => {
                  console.log('Background replaced:', presetId, url);
                }}
              />
            </div>
          )}
        </div>

        {/* ===================== RIGHT PANEL ===================== */}
        {result ? (
          <div className="space-y-6 animate-slide-up">
            {/* Before / After slider */}
            <div className="card p-4">
              <BeforeAfterSlider
                publicId={uploadedPublicId}
                originalUrl={uploadedOriginalUrl}
              />
            </div>

            {/* Platform cards grid */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-foreground">
                  Platform Variants
                </h2>
                <span className="badge-blue">
                  ✓ {Object.keys(result.platforms).length} generated
                </span>
              </div>

              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {(Object.keys(PLATFORM_CONFIGS) as Array<keyof typeof PLATFORM_CONFIGS>).map(
                  (platform) => {
                    const url = result.platforms[platform];
                    if (!url) return null;
                    return (
                      <PlatformCard
                        key={platform}
                        platform={platform}
                        url={url}
                        publicId={uploadedPublicId}
                        isGenFill={PLATFORM_CONFIGS[platform].isGenFill}
                      />
                    );
                  }
                )}
              </div>
            </div>

            {/* Captions */}
            {result.captions && (
              <div className="card p-4">
                <CaptionPanel captions={result.captions} />
              </div>
            )}

            {/* Download all */}
            <div className="card p-4">
              <DownloadAllButton
                urls={result.platforms}
                captions={result.captions}
              />
            </div>

            {/* Processing time */}
            <p className="text-xs text-subtle text-center">
              Processed in {((result.processingTime || 0) / 1000).toFixed(1)}s ·
              Powered by Cloudinary AI + Gemini
            </p>
          </div>
        ) : (
          /* Empty state */
          <div className="flex items-center justify-center h-full min-h-[400px] border-2 border-dashed border-border rounded-xl bg-surface/50">
            <div className="text-center space-y-3 p-8">
              <span className="text-5xl">⚡</span>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Results appear here
                </p>
                <p className="text-xs text-muted mt-1">
                  Upload a photo to see 6 platform-ready images, AI tags, and Hinglish captions
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
