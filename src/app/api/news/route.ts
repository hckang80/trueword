import { fetchRssFeed } from '@/app/entities/news';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const rssFeeds = [{ url: 'https://www.christianity.com/rss', name: 'Christianity Today' }];

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
