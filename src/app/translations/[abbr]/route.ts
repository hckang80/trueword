import type { BibleInstance } from '@/entities/bible';
import axios from 'axios';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ abbr: string }> }
) {
  const { abbr } = await params;

  try {
    const { data } = await axios.get<{ data: BibleInstance }>(
      `${process.env.API_BASE_URL}/${abbr}.json`
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching translations:', error);
    return NextResponse.json({ error: 'Failed to fetch translations' }, { status: 500 });
  }
}
