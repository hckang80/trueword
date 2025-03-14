import { parse } from 'rss-to-json';
import type { NewsItem, RssFeedItem } from '../model';

export async function fetchRssFeed(feedUrl: string, sourceName: string): Promise<NewsItem[]> {
  try {
    const feed = await parse(feedUrl);

    return feed.items.map((item: RssFeedItem) => {
      // 썸네일 이미지 추출 (RSS 형식에 따라 다를 수 있음)
      let thumbnail = '';

      // 일반적인 미디어 RSS 형식에서 이미지 추출
      if (item.enclosures && item.enclosures.length > 0) {
        thumbnail = item.enclosures[0].url;
      } else if (item.media && item.media.thumbnail) {
        thumbnail = item.media.thumbnail.url;
      } else {
        // 이미지 URL을 본문에서 추출하는 방법 (정규식 사용)
        const imgRegex = /<img[^>]+src="([^">]+)"/;
        const match = item.description?.match(imgRegex);
        if (match && match[1]) {
          thumbnail = match[1];
        }
      }

      return {
        title: item.title,
        link: item.link,
        description: item.description,
        pubDate: item.published,
        thumbnail,
        source: sourceName,
        guid: item.id || item.guid || item.link
      };
    });
  } catch (error) {
    console.error(`Error fetching RSS feed ${feedUrl}:`, error);
    return [];
  }
}
