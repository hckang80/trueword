import { fetchRssFeed } from '@/entities/news';
import type { Locale } from '@/shared';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const rssFeeds: { url: string; name: Record<Locale, string> }[] = [
      {
        url: 'https://www.christiantoday.co.kr/rss',
        name: {
          ko: '크리스천투데이',
          en: 'christiantoday'
        }
      },
      {
        url: 'https://www.christiandaily.co.kr/rss',
        name: {
          ko: '기독일보',
          en: 'christiandaily'
        }
      }
    ];

    const newsPromises = rssFeeds.map((source) => fetchRssFeed(source.url, source.name));

    const newsResults = await Promise.all(newsPromises);

    const allNews = newsResults
      .flat()
      .toSorted((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

    return NextResponse.json(allNews);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}
