import type { BibleLanguage } from '@/features/bible';
import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { data } = await axios.get<{ data: BibleLanguage[] }>(
      `${process.env.BIBLE_API_URL}/static/bolls/app/views/languages.json`
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching translations:', error);
    return NextResponse.json({ error: 'Failed to fetch translations' }, { status: 500 });
  }
}
