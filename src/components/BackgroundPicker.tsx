'use client';

import { useState } from 'react';
import { Loader2, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BACKGROUND_PRESETS } from '@/lib/transformations';

interface BackgroundPickerProps {
  publicId: string;
  onResult: (url: string, presetId: string) => void;
}

export default function BackgroundPicker({ publicId, onResult }: BackgroundPickerProps) {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [loadingPreset, setLoadingPreset] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSelect = async (presetId: string, prompt: string) => {
    if (loadingPreset) return;
    setLoadingPreset(presetId);
    setError(null);

    try {
      const response = await fetch('/api/background', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicId, prompt }),
      });

      if (!response.ok) throw new Error('Background replace failed');

      const data = await response.json();
      setSelectedPreset(presetId);
      setResultUrl(data.url);
      onResult(data.url, presetId);
    } catch (err) {
      setError('Background replace failed. Please try again.');
      console.error(err);
    } finally {
      setLoadingPreset(null);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Wand2 className="w-4 h-4 text-blue" />
        <p className="text-sm font-semibold text-foreground">Background Styles</p>
        <span className="text-xs text-muted">(Cloudinary Gen AI)</span>
      </div>

      {/* Preset grid */}
      <div className="grid grid-cols-2 gap-2">
        {BACKGROUND_PRESETS.map((preset) => {
          const isLoading = loadingPreset === preset.id;
          const isSelected = selectedPreset === preset.id;

          return (
            <button
              key={preset.id}
              id={`bg-preset-${preset.id}`}
              onClick={() => handleSelect(preset.id, preset.prompt)}
              disabled={!!loadingPreset}
              className={cn(
                'flex items-center gap-2 px-3 py-2.5 border rounded-lg text-left transition-all text-xs font-medium',
                isSelected
                  ? 'border-blue bg-blue-light text-blue'
                  : isLoading
                  ? 'border-blue/50 bg-blue-light/50 text-blue/70 cursor-wait'
                  : 'border-border hover:border-blue/50 hover:bg-surface text-foreground cursor-pointer',
                loadingPreset && !isLoading && 'opacity-50 cursor-not-allowed'
              )}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin flex-shrink-0 text-blue" />
              ) : (
                <span className="text-base flex-shrink-0">{preset.emoji}</span>
              )}
              <span className="leading-tight">{preset.label}</span>
            </button>
          );
        })}
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs text-red bg-red-light border border-red/20 px-3 py-2 rounded-lg">
          {error}
        </p>
      )}

      {/* Result preview */}
      {resultUrl && (
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="px-3 py-2 border-b border-border bg-surface">
            <p className="text-xs font-medium text-foreground">
              Background applied ·{' '}
              {BACKGROUND_PRESETS.find((p) => p.id === selectedPreset)?.label}
            </p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={resultUrl}
            alt="Background replaced result"
            className="w-full object-contain max-h-48"
            loading="lazy"
          />
        </div>
      )}
    </div>
  );
}
