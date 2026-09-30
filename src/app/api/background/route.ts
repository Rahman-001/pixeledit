import { NextRequest, NextResponse } from 'next/server';
import { cloudinary } from '@/lib/cloudinary';

export async function POST(req: NextRequest) {
  try {
    const { publicId, prompt } = await req.json();

    if (!publicId || !prompt) {
      return NextResponse.json(
        { error: 'publicId and prompt are required' },
        { status: 400 }
      );
    }

    // Generate URL with generative background replacement
    const url = cloudinary.url(publicId, {
      transformation: [
        {
          effect: `gen_background_replace:prompt_${encodeURIComponent(prompt)}`,
        },
        { fetch_format: 'auto', quality: 'auto' },
      ],
      secure: true,
    });

    return NextResponse.json({ success: true, url, prompt });
  } catch (error) {
    console.error('Background API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate background replacement URL' },
      { status: 500 }
    );
  }
}
