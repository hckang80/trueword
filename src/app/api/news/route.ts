import { fetchRssFeed, NewsItem } from '@/features/news';
import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
});

const CACHE_TTL = 30 * 60;
const STALE_TTL = 24 * 60 * 60;

export async function GET() {
  try {
    const cachedNews = await redis.get<NewsItem[]>('rss_news');
    const lastUpdated = await redis.get<number>('rss_news_updated');

    if (cachedNews) {
      if (lastUpdated && Date.now() - lastUpdated > CACHE_TTL * 1000) {
        revalidateData().catch(console.error);
      }
      return NextResponse.json(cachedNews);
    }

    const allNews = await fetchFreshData();
    return NextResponse.json(allNews);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}

async function fetchFreshData() {
  const rssFeeds: { url: string; name: Record<string, string> }[] = [
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
    },
    {
      url: 'https://kcnp.com/rss',
      name: {
        ko: '한국기독신문',
        en: 'kcnp'
      }
    }
    // {
    //   url: 'https://www.knewsm.kr/rss/allArticle.xml',
    //   name: {
    //     ko: '뉴스엠',
    //     en: 'newsM'
    //   }
    // }
    // {
    //   url: 'https://rss.nocutnews.co.kr/christian/news.xml',
    //   name: {
    //     ko: '크리스천 노컷뉴스',
    //     en: 'nocutnews'
    //   }
    // }
  ];

  const newsPromises = rssFeeds.map((source) =>
    Promise.race([
      fetchRssFeed(source.url, source.name),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))
    ])
  );

  const newsResults = await Promise.allSettled(newsPromises);
  const allNews = newsResults
    .filter((result): result is PromiseFulfilledResult<NewsItem> => result.status === 'fulfilled')
    .map((result) => result.value)
    .flat()
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  await Promise.all([
    redis.set('rss_news', allNews, { ex: STALE_TTL }),
    redis.set('rss_news_updated', Date.now(), { ex: STALE_TTL })
  ]);

  return allNews;
}

async function revalidateData() {
  const freshData = await fetchFreshData();
  return freshData;
}
