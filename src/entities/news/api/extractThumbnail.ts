import { RSSItem } from '..';

export const extractThumbnail = (item: RSSItem): string | undefined => {
  if (item.media?.length) {
    const mediaImages = item.media.filter((m) => m.type.startsWith('image/'));

    if (mediaImages.length) {
      return mediaImages[0].url;
    }
  }

  if (item['media:thumbnail']?.length) {
    const [thumbnail] = item['media:thumbnail'];
    if (typeof thumbnail === 'object' && thumbnail.$ && thumbnail.$.url) {
      return thumbnail.$.url;
    } else if (typeof thumbnail === 'object' && thumbnail.url) {
      return thumbnail.url;
    }
  }

  if (
    item.enclosure &&
    item.enclosure.url &&
    item.enclosure.type &&
    item.enclosure.type.startsWith('image/')
  ) {
    return item.enclosure.url;
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
