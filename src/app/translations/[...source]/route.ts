import { BookId, type NewVerses } from '@/features/bible';
import axios from 'axios';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ source: string[] }> }
) {
  const { source } = await params;
  const [abbr, bookNumber, chapterNumber] = source;

  try {
    const {
      data: { results }
    } = await axios.get<{ results: NewVerses[] }>(`${process.env.BIBLE_API_URL}/api`, {
      params: {
        bible: abbr,
        reference: `${BookId[+bookNumber]} ${chapterNumber}`
      }
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching translations:', error);
    return NextResponse.json({ error: 'Failed to fetch translations' }, { status: 500 });
  }
}
