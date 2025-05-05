import type { RSSFeed, RSSItem } from '../model';
import axios from 'axios';
import Parser from 'rss-parser';
import { extractThumbnail } from '..';
import { extractLastNumber } from '@/shared';

export async function fetchRssFeed(feedUrl: string, sourceName: Record<string, string>) {
  try {
    const response = await axios.get<string>(feedUrl, {
      headers: {
        'User-Agent': globalThis.navigator.userAgent
      }
    });

    const parser = new Parser<RSSFeed, RSSItem>({
      customFields: {
        item: [
          ['atom:published', 'pubDate'],
          ['media:content', 'thumbnail', { keepArray: true }]
        ]
      }
    });

    const feed = await parser.parseString(response.data);

    return feed.items.map((item) => {
      const { title, link, description = '', pubDate, guid } = item;

      const parsedDate = pubDate ? new Date(pubDate.replace('KST', '')) : undefined;

      return {
        title,
        link,
        description,
        pubDate: parsedDate?.toISOString() || '',
        thumbnail: extractThumbnail(item),
        source: sourceName.ko,
        sourceEng: sourceName.en,
        guid: extractLastNumber(guid || link)
      };
    });
  } catch (error) {
    console.error(`Error fetching RSS feed ${feedUrl}:`, error);
    return [];
  }
}
