import type { BibleTransitionResponse } from '@/features/bible';
import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const {
      data: { results }
    } = await axios.get<{ results: Record<string, BibleTransitionResponse> }>(
      `${process.env.BIBLE_API_URL}/api/bibles`
    );

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching translations:', error);
    return NextResponse.json({ error: 'Failed to fetch translations' }, { status: 500 });
  }
}
