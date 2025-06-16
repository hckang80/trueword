import type { Verse } from '@/features/bible';
import axios from 'axios';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ source: string[] }> }
) {
  const { source } = await params;
  const [abbr, bookNumber, chapterNumber] = source;

  try {
    const { data } = await axios.get<{ data: Verse[] }>(
      `${process.env.BIBLE_API_URL}/get-chapter/${abbr}/${bookNumber}/${chapterNumber}`
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching translations:', error);
    return NextResponse.json({ error: 'Failed to fetch translations' }, { status: 500 });
  }
}
