import { NextRequest, NextResponse } from 'next/server';
import { generateCaptions } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const { tags } = await req.json();

    if (!tags || !Array.isArray(tags)) {
      return NextResponse.json({ error: 'tags array is required' }, { status: 400 });
    }

    const captions = await generateCaptions(tags);

    return NextResponse.json({ success: true, captions });
  } catch (error) {
    console.error('Captions API error:', error);
    return NextResponse.json({ error: 'Failed to generate captions' }, { status: 500 });
  }
}
