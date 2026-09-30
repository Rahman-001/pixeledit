import { NextRequest, NextResponse } from 'next/server';
import { cloudinary, generatePlatformUrls, getAutoTags } from '@/lib/cloudinary';
import { generateCaptions } from '@/lib/gemini';
import { saveUpload } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { publicId, sessionId, originalUrl } = await req.json();

    if (!publicId) {
      return NextResponse.json({ error: 'publicId is required' }, { status: 400 });
    }

    const startTime = Date.now();

    // Step 1: Generate all 6 platform URLs
    let platforms = generatePlatformUrls(publicId);

    // If local uploaded image, use the original image URL for platform cards
    const isLocalUpload = originalUrl && (originalUrl.startsWith('blob:') || originalUrl.startsWith('data:'));
    if (isLocalUpload) {
      platforms = {
        instagram: originalUrl,
        whatsapp: originalUrl,
        flipkart: originalUrl,
        amazon: originalUrl,
        facebook: originalUrl,
        meesho: originalUrl,
      };
    }

    // Step 2: Fetch auto-tags from Cloudinary (or fallback for demo mode)
    let tags: string[] = [];
    try {
      if (!isLocalUpload) {
        const resource = await cloudinary.api.resource(publicId, { tags: true });
        tags = resource.tags || [];
      }
    } catch {
      console.warn('Auto-tag fetch failed, using fallback tags');
    }

    if (tags.length === 0) {
      tags = ['product', 'premium', 'lifestyle', 'ecommerce', 'quality'];
    }

    // Step 3: Generate captions via Gemini
    let captions = {
      instagram: [] as string[],
      whatsapp: [] as string[],
      flipkart: [] as string[],
      facebook: [] as string[],
    };

    try {
      captions = await generateCaptions(tags);
    } catch {
      console.warn('Caption generation failed, using fallback captions');
      captions = {
        instagram: ['✨ Upgrade your style with this premium product! Shop now.', '🔥 Best seller of the season! Link in bio.'],
        whatsapp: ['📲 Order now on WhatsApp! Free delivery available.', '⭐ Top rated product in stock! Chat with us to buy.'],
        flipkart: ['🛒 Special Flipkart discount active! Buy now.', '⚡ Limited time deal - grab yours today!'],
        facebook: ['📣 Don\'t miss out on this amazing offer!', '👉 Click below to explore exclusive deals.'],
      };
    }

    // Step 4: Save to Supabase
    if (sessionId) {
      try {
        await saveUpload({
          user_session_id: sessionId,
          cloudinary_public_id: publicId,
          original_url: originalUrl || '',
          platform_urls: platforms,
          tags,
          captions,
        });
      } catch {
        console.warn('Supabase save failed, continuing');
      }
    }

    const processingTime = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      platforms,
      tags,
      captions,
      originalUrl,
      processingTime,
    });
  } catch (error) {
    console.error('Process API error:', error);
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    );
  }
}
