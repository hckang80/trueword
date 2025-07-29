import type { NewsItemType } from '../model';
import type { RSSInstance, RSSInstanceItem, RSSFeed } from '@/entities/rss';
import axios from 'axios';
import Parser from 'rss-parser';
import { extractThumbnail } from '@/features/news/lib';
import { extractUniqId } from '@/shared';

export async function fetchNewsFeed({
  url: feedUrl,
  name: sourceName,
  locale
}: RSSFeed): Promise<NewsItemType[]> {
  try {
    const response = await axios.get<string>(feedUrl, {
      headers: {
        'User-Agent': globalThis.navigator.userAgent
      }
    });

    const parser = new Parser<RSSInstance, RSSInstanceItem>({
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
      } catch {}

      return {
        title,
        link,
        description: fullContent || description,
        pubDate: parsedDate?.toISOString() || '',
        thumbnail: originThumbnail,
        source: sourceName.native || sourceName.global,
        sourceEng: sourceName.global,
        guid: extractUniqId(postId || guid || link),
        locale
      };
    });
  } catch (error) {
    console.error(`Error fetching RSS feed ${feedUrl}:`, error);
    return [];
  }
}
