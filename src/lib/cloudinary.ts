import { v2 as cloudinary } from 'cloudinary';
import { PLATFORM_CONFIGS } from './transformations';

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const isCloudConfigured = Boolean(cloudName && cloudName !== 'your_cloud_name_here');

// Configure Cloudinary SDK (server-side only)
cloudinary.config({
  cloud_name: isCloudConfigured ? cloudName : 'demo',
  api_key: process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_KEY !== 'your_api_key_here' ? process.env.CLOUDINARY_API_KEY : undefined,
  api_secret: process.env.CLOUDINARY_API_SECRET && process.env.CLOUDINARY_API_SECRET !== 'your_api_secret_here' ? process.env.CLOUDINARY_API_SECRET : undefined,
  secure: true,
});

export { cloudinary };

export interface PlatformUrls {
  instagram: string;
  whatsapp: string;
  flipkart: string;
  amazon: string;
  facebook: string;
  meesho: string;
}

/**
 * Generate all 6 platform-specific Cloudinary URLs for a given public_id.
 * Uses inline transformation chains (works without named transformations).
 */
export function generatePlatformUrls(publicId: string): PlatformUrls {
  const urls: Partial<PlatformUrls> = {};

  for (const [key, config] of Object.entries(PLATFORM_CONFIGS)) {
    urls[key as keyof PlatformUrls] = cloudinary.url(publicId, {
      transformation: config.transformation,
      secure: true,
    } as Parameters<typeof cloudinary.url>[1]);
  }

  return urls as PlatformUrls;
}

/**
 * Generate a background-replaced URL using Cloudinary Generative Background Replace.
 */
export function generateBackgroundReplaceUrl(publicId: string, prompt: string): string {
  return cloudinary.url(publicId, {
    transformation: [
      {
        effect: `gen_background_replace:prompt_${encodeURIComponent(prompt)}`,
      },
      { fetch_format: 'auto', quality: 'auto' },
    ],
    secure: true,
  });
}

/**
 * Generate a watermarked URL.
 */
export function generateWatermarkedUrl(publicId: string): string {
  return cloudinary.url(publicId, {
    transformation: [
      {
        overlay: 'text:Arial_16:VisualCraft',
        gravity: 'south_east',
        opacity: 30,
        color: '#FFFFFF',
      },
    ],
    fetch_format: 'auto',
    quality: 'auto',
    secure: true,
  });
}

/**
 * Fetch auto-tags from Cloudinary Admin API for a given public_id.
 */
export async function getAutoTags(publicId: string): Promise<string[]> {
  try {
    const result = await cloudinary.api.resource(publicId, {
      tags: true,
    });
    return result.tags || [];
  } catch (error) {
    console.error('Failed to fetch auto-tags:', error);
    return [];
  }
}

/**
 * Trigger an explicit upload with auto-tagging enabled.
 * Used in upload preset as fallback.
 */
export async function uploadWithAutoTag(
  fileUrl: string,
  sessionId: string
): Promise<{ publicId: string; tags: string[]; originalUrl: string }> {
  const result = await cloudinary.uploader.upload(fileUrl, {
    upload_preset: 'visualcraft_unsigned',
    auto_tagging: 0.6,
    categorization: 'google_tagging',
    folder: `visualcraft/${sessionId}`,
    context: {
      upload_source: 'web',
      platform: 'visualcraft',
    },
  });

  return {
    publicId: result.public_id,
    tags: result.tags || [],
    originalUrl: result.secure_url,
  };
}
