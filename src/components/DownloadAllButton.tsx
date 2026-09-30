'use client';

import { useState } from 'react';
import { Download, Loader2, Package } from 'lucide-react';
import { downloadBlob } from '@/lib/utils';

interface DownloadAllButtonProps {
  urls: Record<string, string>;
  captions?: {
    instagram: string[];
    whatsapp: string[];
    flipkart: string[];
    facebook: string[];
  };
}

export default function DownloadAllButton({ urls, captions }: DownloadAllButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const platformCount = Object.keys(urls).length;

  const handleDownload = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          urls,
          captions,
          filename: `visualcraft_${Date.now()}`,
        }),
      });

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      downloadBlob(blob, `visualcraft_export_${Date.now()}.zip`);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Download failed. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        id="download-all-button"
        onClick={handleDownload}
        disabled={isLoading || platformCount === 0}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-foreground text-white text-sm font-semibold rounded-xl hover:bg-foreground/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Creating ZIP...
          </>
        ) : success ? (
          <>
            <Package className="w-4 h-4" />
            Downloaded!
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            Download All ({platformCount} images + captions)
          </>
        )}
      </button>

      {error && (
        <p className="text-xs text-red text-center">{error}</p>
      )}

      <p className="text-[10px] text-subtle text-center">
        ZIP includes {platformCount} platform images + captions.txt
      </p>
    </div>
  );
}
