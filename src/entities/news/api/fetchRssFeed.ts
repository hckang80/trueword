import type { RSSFeed, RSSItem } from '../model';
import axios from 'axios';
import Parser from 'rss-parser';
import { extractThumbnail } from '..';

export async function fetchRssFeed(feedUrl: string, sourceName: Record<string, string>) {
  try {
    const response = await axios.get<string>(feedUrl);

    const parser = new Parser<RSSFeed, RSSItem>({
      customFields: {
        item: [['media:content', 'media:thumbnail', { keepArray: true }]]
      }
    });

    const feed = await parser.parseString(response.data);

    return feed.items.map((item) => {
      const { title, link, description, pubDate } = item;

      return {
        title,
        link,
        description,
        pubDate: (pubDate || '').replace('KST', ''),
        thumbnail: extractThumbnail(item),
        source: sourceName.ko,
        sourceEng: sourceName.en,
        guid: link.split('/').pop()
      };
    });
  } catch (error) {
    console.error(`Error fetching RSS feed ${feedUrl}:`, error);
    return [];
  }
}
