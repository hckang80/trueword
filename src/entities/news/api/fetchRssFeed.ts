import type { RSSFeed, RSSItem } from '../model';
import axios from 'axios';
import Parser from 'rss-parser';
import { extractThumbnail } from '..';
import { extractLastNumber } from '@/shared';

export async function fetchRssFeed(feedUrl: string, sourceName: Record<string, string>) {
  try {
    const response = await axios.get<string>(feedUrl);

    const parser = new Parser<RSSFeed, RSSItem>({
      customFields: {
        item: [['media:content', 'media:thumbnail', { keepArray: true }]]
      }
    });

    const feed = await parser.parseString(response.data);

    return feed.items.map((item, index) => {
      const { title, link, description, pubDate, guid } = item;

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
