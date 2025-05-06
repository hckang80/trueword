import type { BibleChapterInstance } from '@/entities/bible';
import axios from 'axios';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ source: string[] }> }
) {
  const { source } = await params;
  const [abbr, bookNumber, chapterNumber] = source;

  try {
    const { data } = await axios.get<{ data: BibleChapterInstance }>(
      `${process.env.API_BASE_URL}/${abbr}/${bookNumber}/${chapterNumber}.json`
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching translations:', error);
    return NextResponse.json({ error: 'Failed to fetch translations' }, { status: 500 });
  }
}
