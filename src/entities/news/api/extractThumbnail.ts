import { RSSItem } from '..';
import { JSDOM } from 'jsdom';

function extractFirstImageUrl(htmlContent: string): string | undefined {
  if (!htmlContent) return;

  try {
    const dom = new JSDOM(htmlContent);
    const imgElement: HTMLImageElement | null = dom.window.document.querySelector('img');

    return imgElement?.src;
  } catch (error) {
    console.error('이미지 추출 오류:', error);
    return;
  }
}

export const extractThumbnail = (item: RSSItem): string | undefined => {
  if (item.media?.length) {
    const mediaImages = item.media.filter((m) => m.type.startsWith('image/'));

    if (mediaImages.length) {
      return mediaImages[0].url;
    }
  }

  if (item['thumbnail']?.length) {
    const [thumbnail] = item['thumbnail'];
    return thumbnail.$?.url || thumbnail.url;
  }

  if (
    item.enclosure &&
    item.enclosure.url &&
    item.enclosure.type &&
    item.enclosure.type.startsWith('image/')
  ) {
    return item.enclosure.url;
  }

  if (item['content:encoded']) {
    return extractFirstImageUrl(item['content:encoded']);
  }

  const contentToCheck = item.contentEncoded || item.content || item.description || '';
  const imgMatch = contentToCheck.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
  if (imgMatch && imgMatch?.[1]) {
    return imgMatch[1];
  }

  if (item['itunes:image'] && typeof item['itunes:image'] === 'object') {
    const itunesImage = item['itunes:image'];
    if (itunesImage.$ && itunesImage.$.href) {
      return itunesImage.$.href;
    } else if (itunesImage.href) {
      return itunesImage.href;
    }
  }

  return;
};
