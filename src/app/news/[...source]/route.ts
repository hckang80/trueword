import { fetchNews, getNewsItem } from '@/features/news';
import { type NextRequest, NextResponse } from 'next/server';
import { DEFAULT_LOCALE } from '@/shared';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ source: string[] }> }
) {
  const locale = request.headers.get('Accept-Language') || DEFAULT_LOCALE;
  const { source } = await params;

  try {
    const news = await fetchNews(locale);

    return NextResponse.json(getNewsItem(news, source));
  } catch (error) {
    console.error('Error fetching translations:', error);
    return NextResponse.json({ error: 'Failed to fetch translations' }, { status: 500 });
  }
}
