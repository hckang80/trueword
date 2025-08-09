import type { NewBibleBook } from '@/features/bible';
import axios from 'axios';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ translation: string }> }
) {
  const { translation: locale } = await params;

  try {
    const {
      data: { results }
    } = await axios.get<{ results: NewBibleBook[] }>(`${process.env.BIBLE_API_URL}/api/books`, {
      params: {
        language: locale
      }
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching translations:', error);
    return NextResponse.json({ error: 'Failed to fetch translations' }, { status: 500 });
  }
}
