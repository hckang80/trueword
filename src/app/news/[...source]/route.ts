import { NewsItemType } from '@/features/news';
import { getNewsItem } from '@/features/bible';
import { type NextRequest, NextResponse } from 'next/server';
import { axiosInstance } from '@/shared';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ source: string[] }> }
) {
  const { source } = await params;

  try {
    const { data: news } = await axiosInstance.get<NewsItemType[]>('/api/news');

    return NextResponse.json(getNewsItem(news, source));
  } catch (error) {
    console.error('Error fetching translations:', error);
    return NextResponse.json({ error: 'Failed to fetch translations' }, { status: 500 });
  }
}
