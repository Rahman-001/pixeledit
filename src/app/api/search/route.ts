export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { cloudinary } from '@/lib/cloudinary';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || '';
    const maxResults = parseInt(searchParams.get('max_results') || '20', 10);
    const sessionId = searchParams.get('session_id') || '';

    // Build search expression
    let expression = 'resource_type:image';
    if (q) {
      expression += ` AND tags:${q}`;
    }
    if (sessionId) {
      expression += ` AND folder=visualcraft/${sessionId}`;
    }

    const result = await cloudinary.search
      .expression(expression)
      .sort_by('created_at', 'desc')
      .max_results(maxResults)
      .with_field('tags')
      .with_field('context')
      .execute();

    return NextResponse.json({
      success: true,
      resources: result.resources || [],
      total: result.total_count || 0,
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
