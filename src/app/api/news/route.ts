import { fetchNewsFeed, NewsItemType } from '@/features/news';
import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { RSS_FEEDS } from '@/entities/rss';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
});

const CACHE_TTL = 24 * 60 * 60;
const CACHE_KEY = 'rss_news';

export async function GET() {
  try {
    const cachedNews = await redis.get<NewsItemType[]>(CACHE_KEY);
    const allNews = cachedNews || (await fetchFreshData());

    return NextResponse.json(allNews);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}

async function fetchFreshData() {
  const newsPromises = RSS_FEEDS.map(fetchNewsFeed);
  const newsResults = await Promise.all(newsPromises);
  const allNews = newsResults
    .flat()
    .toSorted((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  await redis.set(CACHE_KEY, allNews, { ex: CACHE_TTL });

  return allNews;
}
