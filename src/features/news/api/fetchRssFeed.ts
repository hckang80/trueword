import type { NewsItem, RSSFeed, RSSItem } from '../model';
import axios from 'axios';
import Parser from 'rss-parser';
import { extractThumbnail } from '@/features/news/lib';
import { extractLastNumber } from '@/shared';

export async function fetchRssFeed(
  feedUrl: string,
  sourceName: Record<string, string>,
  locale: string
): Promise<NewsItem[]> {
  try {
    const response = await axios.get<string>(feedUrl, {
      headers: {
        'User-Agent': globalThis.navigator.userAgent
      }
    });

    const parser = new Parser<RSSFeed, RSSItem>({
      customFields: {
        item: [
          ['post-id', 'postId'],
          ['atom:published', 'pubDate'],
          ['content:encoded', 'fullContent'],
          ['media:content', 'thumbnail', { keepArray: true }]
        ]
      }
    });

    const feed = await parser.parseString(response.data);

    return feed.items.map((item) => {
      const { title, link, fullContent = '', description = '', pubDate, guid, postId } = item;

      const parsedDate = pubDate ? new Date(pubDate.replace('KST', '')) : undefined;

      let originThumbnail = '';
      try {
        const { origin, pathname } = new URL(extractThumbnail(item) || '');
        originThumbnail = `${origin}${pathname}`;
      } catch {
        console.warn('확인 가능한 이미지 없음');
      }

      return {
        title,
        link,
        description: fullContent || description,
        pubDate: parsedDate?.toISOString() || '',
        thumbnail: originThumbnail,
        source: sourceName.ko,
        sourceEng: sourceName.en,
        guid: extractLastNumber(postId || guid || link),
        locale
      };
    });
  } catch (error) {
    console.error(`Error fetching RSS feed ${feedUrl}:`, error);
    return [];
  }
}
