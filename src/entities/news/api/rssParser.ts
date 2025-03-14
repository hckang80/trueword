import { parse } from 'rss-to-json';
import type { NewsItem, RssFeedItem } from '../model';

export async function fetchRssFeed(feedUrl: string, sourceName: string): Promise<NewsItem[]> {
  try {
    const feed = await parse(feedUrl);

    return feed.items.map((item: RssFeedItem) => {
      const { title, link, description, published: pubDate, id, guid } = item;

      return {
        title,
        link,
        description,
        pubDate,
        thumbnail: generateThumbnail(item),
        source: sourceName,
        guid: id || guid || link
      };
    });
  } catch (error) {
    console.error(`Error fetching RSS feed ${feedUrl}:`, error);
    return [];
  }
}

function generateThumbnail(item: RssFeedItem): string {
  if (item.enclosures?.length) return item.enclosures[0].url;
  if (item.media?.thumbnail) return item.media.thumbnail.url;

  const imgRegex = /<img[^>]+src="([^">]+)"/;
  const [, url] = item.description?.match(imgRegex) || [];
  return url;
}
