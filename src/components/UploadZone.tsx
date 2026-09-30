'use client';

import { useState, useCallback, useRef } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { Upload, Smartphone, X, CheckCircle2, Sparkles, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadedFile {
  publicId: string;
  secureUrl: string;
  originalFilename: string;
  bytes: number;
}

interface UploadZoneProps {
  onUploadSuccess: (file: UploadedFile) => void;
  isProcessing?: boolean;
}

const SAMPLE_PHOTOS = [
  {
    name: 'Red Sneakers',
    publicId: 'sample-sneakers',
    url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    emoji: '👟',
    bytes: 124000,
  },
  {
    name: 'Luxury Watch',
    publicId: 'sample-watch',
    url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    emoji: '⌚',
    bytes: 185000,
  },
  {
    name: 'Leather Bag',
    publicId: 'sample-bag',
    url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
    emoji: '👜',
    bytes: 210000,
  },
];

export default function UploadZone({ onUploadSuccess, isProcessing = false }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const isCloudinaryConfigured = Boolean(
    cloudName && cloudName !== 'your_cloud_name_here' && cloudName.trim() !== ''
  );

  const registerFile = useCallback(
    (file: UploadedFile) => {
      setUploadedFiles((prev) => [...prev, file].slice(0, 5));
      onUploadSuccess(file);
    },
    [onUploadSuccess]
  );

  const handleSuccess = useCallback(
    (result: { info: { public_id: string; secure_url: string; original_filename: string; bytes: number } }) => {
      if (result?.info?.public_id && result?.info?.secure_url) {
        registerFile({
          publicId: result.info.public_id,
          secureUrl: result.info.secure_url,
          originalFilename: result.info.original_filename || 'Uploaded Image',
          bytes: result.info.bytes || 0,
        });
      }
    },
    [registerFile]
  );

  const handleLocalFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        registerFile({
          publicId: `local-${Date.now()}`,
          secureUrl: dataUrl,
          originalFilename: file.name,
          bytes: file.size,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleLocalFile(files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (isProcessing) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleLocalFile(e.dataTransfer.files[0]);
    }
  };

  const handleSampleClick = (sample: (typeof SAMPLE_PHOTOS)[0]) => {
    if (isProcessing) return;
    registerFile({
      publicId: sample.publicId,
      secureUrl: sample.url,
      originalFilename: sample.name,
      bytes: sample.bytes,
    });
  };

  const renderDropArea = (openWidget?: () => void) => (
    <div
      id="upload-zone"
      onClick={() => {
        if (isProcessing) return;
        if (isCloudinaryConfigured && openWidget) {
          openWidget();
        } else {
          fileInputRef.current?.click();
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragEnter={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setIsDragging(false);
      }}
      onDrop={handleDrop}
      className={cn(
        'relative min-h-[220px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200 select-none p-4',
        isProcessing
          ? 'border-green/50 bg-green-light cursor-not-allowed'
          : isDragging
          ? 'border-blue bg-blue-light scale-[1.01]'
          : 'border-border-focus bg-surface hover:border-blue hover:bg-blue-light'
      )}
    >
      {isProcessing ? (
        <div className="flex flex-col items-center gap-3 text-green">
          <CheckCircle2 className="w-10 h-10 animate-pulse" />
          <p className="text-sm font-medium">Processing your image...</p>
        </div>
      ) : (
        <>
          {/* Icon */}
          <div
            className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center transition-colors',
              isDragging ? 'bg-blue text-white' : 'bg-background text-muted'
            )}
          >
            <Smartphone className="w-6 h-6" />
          </div>

          {/* Text */}
          <div className="text-center space-y-1 px-4">
            <p className="text-sm font-medium text-foreground">
              अपनी product photo यहाँ डालें
            </p>
            <p className="text-xs text-muted">
              Drop your product photo here · or click to browse
            </p>
            <p className="text-[11px] text-subtle">
              JPEG, PNG, WebP · max 5 files
            </p>
          </div>

          {/* Upload icon */}
          <div className="flex items-center gap-1.5 px-4 py-2 bg-blue text-white text-xs font-medium rounded-md hover:bg-blue-hover transition-colors">
            <Upload className="w-3.5 h-3.5" />
            Choose File
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Hidden file input for direct fallback */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
      />

      {/* Cloudinary Widget if configured, else standard area */}
      {isCloudinaryConfigured ? (
        <CldUploadWidget
          uploadPreset="visualcraft_unsigned"
          onSuccess={handleSuccess as Parameters<typeof CldUploadWidget>[0]['onSuccess']}
          onError={(err) => {
            console.warn('Cloudinary upload widget error:', err);
          }}
          options={{
            multiple: true,
            maxFiles: 5,
            clientAllowedFormats: ['jpeg', 'jpg', 'png', 'webp'],
            showPoweredBy: false,
            sources: ['local', 'camera', 'url'],
            cropping: false,
            styles: {
              palette: {
                window: '#FAFAF8',
                sourceBg: '#F4F3F1',
                windowBorder: '#E5E4E1',
                tabIcon: '#2563EB',
                menuIcons: '#6B7280',
                textDark: '#1C1C1A',
                textLight: '#FFFFFF',
                link: '#2563EB',
                action: '#2563EB',
                inactiveTabIcon: '#9CA3AF',
                error: '#DC2626',
                inProgress: '#2563EB',
                complete: '#16A34A',
                sourceBgHover: '#E5E4E1',
              },
            },
          }}
        >
          {({ open }) => renderDropArea(open)}
        </CldUploadWidget>
      ) : (
        renderDropArea()
      )}

      {/* Unconfigured Cloudinary Notice Banner */}
      {!isCloudinaryConfigured && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2.5 text-xs text-amber-900 shadow-sm">
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600" />
          <div className="space-y-0.5">
            <p className="font-semibold text-amber-900">Demo Upload Mode Active</p>
            <p className="text-[11px] text-amber-800">
              Cloudinary API key is not set in <span className="font-mono bg-amber-100 px-1 py-0.5 rounded font-semibold text-amber-900">.env.local</span>. Local file uploads and test sample images are active.
            </p>
          </div>
        </div>
      )}

      {/* Quick Sample Photos */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-muted uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-blue" />
            Or Try Sample Product Photo
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {SAMPLE_PHOTOS.map((sample) => (
            <button
              key={sample.publicId}
              type="button"
              disabled={isProcessing}
              onClick={() => handleSampleClick(sample)}
              className="flex flex-col items-center justify-center p-2 bg-surface hover:bg-blue-light/50 border border-border hover:border-blue/40 rounded-lg transition-all text-center group disabled:opacity-50"
            >
              <span className="text-xl group-hover:scale-110 transition-transform mb-1">
                {sample.emoji}
              </span>
              <span className="text-[11px] font-medium text-foreground truncate w-full">
                {sample.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Uploaded files list */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted uppercase tracking-wider">
            Uploaded ({uploadedFiles.length})
          </p>
          {uploadedFiles.map((file, i) => (
            <div
              key={`${file.publicId}-${i}`}
              className="flex items-center gap-3 px-3 py-2.5 bg-surface border border-border rounded-lg"
            >
              <div className="w-7 h-7 rounded bg-green-light flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-4 h-4 text-green" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">
                  {file.originalFilename || `Image ${i + 1}`}
                </p>
                {file.bytes > 0 && (
                  <p className="text-xs text-muted">
                    {(file.bytes / 1024).toFixed(0)} KB
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setUploadedFiles((prev) => prev.filter((_, idx) => idx !== i));
                }}
                className="text-subtle hover:text-foreground transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

