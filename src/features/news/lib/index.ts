import type { NewsItemType } from '..';

export * from './extractThumbnail';

export function getNewsItem(news: NewsItemType[], [source, id]: string[]) {
  return news.find(({ guid, sourceEng }) => guid === id && sourceEng && source);
}
