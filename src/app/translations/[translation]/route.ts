import type { TranslationBooks } from '@/entities/bible';
import axios from 'axios';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ translation: string }> }
) {
  const { translation } = await params;

  try {
    const { data } = await axios.get<{ data: TranslationBooks }>(
      `${process.env.API_BASE_URL}/${translation}/books.json`
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching translations:', error);
    return NextResponse.json({ error: 'Failed to fetch translations' }, { status: 500 });
  }
}
