import type { RSSFeed, RSSItem } from '../model';
import axios from 'axios';
import Parser from 'rss-parser';

export async function fetchRssFeed(feedUrl: string, sourceName: string) {
  try {
    const response = await axios.get<string>(feedUrl);

    const parser = new Parser<RSSFeed, RSSItem>({
      customFields: {
        item: [['media:content', 'media:thumbnail', { keepArray: true }]]
      }
    });

    const feed = await parser.parseString(response.data);

    return feed.items.map((item) => {
      const { title, link, description, pubDate, guid } = item;

      return {
        title,
        link,
        description,
        pubDate: (pubDate || '').replace('KST', ''),
        source: sourceName,
        guid: guid || link
      };
    });
  } catch (error) {
    console.error(`Error fetching RSS feed ${feedUrl}:`, error);
    return [];
  }
}
