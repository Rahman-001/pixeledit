'use client';

import { useState } from 'react';
import { Copy, CheckCircle2, MessageSquare } from 'lucide-react';
import { cn, copyToClipboard } from '@/lib/utils';

interface CaptionPanelProps {
  captions: {
    instagram: string[];
    whatsapp: string[];
    flipkart: string[];
    facebook: string[];
  };
}

const TABS = [
  { key: 'instagram', label: 'Instagram', emoji: '📸', maxChars: 150 },
  { key: 'whatsapp', label: 'WhatsApp', emoji: '💬', maxChars: 80 },
  { key: 'flipkart', label: 'Flipkart', emoji: '🛒', maxChars: 120 },
  { key: 'facebook', label: 'Facebook', emoji: '📣', maxChars: 200 },
] as const;

type TabKey = (typeof TABS)[number]['key'];

export default function CaptionPanel({ captions }: CaptionPanelProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('instagram');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const currentTab = TABS.find((t) => t.key === activeTab)!;
  const currentCaptions = captions[activeTab] || [];

  const handleCopy = async (text: string, index: number) => {
    await copyToClipboard(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-blue" />
        <p className="text-sm font-semibold text-foreground">AI Captions</p>
        <span className="text-xs text-muted">(Hinglish · Gemini AI)</span>
      </div>

      {/* Platform tabs */}
      <div className="flex gap-1 bg-surface p-1 rounded-lg border border-border">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            id={`caption-tab-${tab.key}`}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-medium rounded-md transition-all',
              activeTab === tab.key
                ? 'bg-white text-foreground shadow-card border border-border'
                : 'text-muted hover:text-foreground'
            )}
          >
            <span className="hidden sm:inline">{tab.emoji}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Captions */}
      <div className="space-y-2">
        {currentCaptions.length === 0 ? (
          <div className="text-center py-6 text-sm text-muted bg-surface rounded-lg border border-border">
            No captions generated yet
          </div>
        ) : (
          currentCaptions.map((caption, i) => (
            <div
              key={i}
              className="group flex gap-3 p-3 bg-surface border border-border rounded-lg hover:border-border-focus transition-colors"
            >
              {/* Caption number */}
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-background border border-border text-xs text-muted flex items-center justify-center font-medium">
                {i + 1}
              </span>

              {/* Caption text */}
              <div className="flex-1 min-w-0 space-y-1.5">
                <p className="text-xs text-foreground leading-relaxed">{caption}</p>
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      'text-[10px] font-mono',
                      caption.length > currentTab.maxChars
                        ? 'text-amber'
                        : 'text-muted'
                    )}
                  >
                    {caption.length}/{currentTab.maxChars} chars
                  </span>
                </div>
              </div>

              {/* Copy button */}
              <button
                id={`copy-caption-${activeTab}-${i}`}
                onClick={() => handleCopy(caption, i)}
                className={cn(
                  'flex-shrink-0 p-1.5 rounded-md transition-all',
                  copiedIndex === i
                    ? 'text-green bg-green-light'
                    : 'text-subtle hover:text-foreground hover:bg-background opacity-0 group-hover:opacity-100'
                )}
              >
                {copiedIndex === i ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
