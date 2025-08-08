import type { NewVerseInstance } from '@/features/bible';
import axios from 'axios';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ source: string[] }> }
) {
  const { source } = await params;
  const [abbr, bookNumber, chapterNumber] = source;

  try {
    // https://api.biblesupersearch.com/api/books
    const { data } = await axios.get<{ data: NewVerseInstance }>(
      `${process.env.BIBLE_API_URL}/api`,
      {
        params: {
          bible: abbr,
          reference: `${'Gen'} ${chapterNumber}`
        }
        // /${abbr}/${bookNumber}/${chapterNumber}
      }
    );
    console.log({ data });
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching translations:', error);
    return NextResponse.json({ error: 'Failed to fetch translations' }, { status: 500 });
  }
}
