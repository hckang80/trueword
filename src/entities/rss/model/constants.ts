import { RSSFeed } from './types';

export const RSS_FEEDS: RSSFeed[] = [
  {
    url: 'https://www.christianitytoday.com/rss',
    name: {
      ko: 'christianitytoday',
      en: 'christianitytoday'
    },
    locale: 'en'
  },
  {
    url: 'https://www.christiantoday.co.kr/rss',
    imageUrl: 'images.christiantoday.co.kr',
    name: {
      ko: '크리스천투데이',
      en: 'christiantoday'
    },
    locale: 'ko'
  },
  {
    url: 'https://www.christiandaily.co.kr/rss',
    imageUrl: 'images.christiandaily.co.kr',
    name: {
      ko: '기독일보',
      en: 'christiandaily'
    },
    locale: 'ko'
  },
  {
    url: 'https://www.kcnp.com/rss',
    name: {
      ko: '한국기독신문',
      en: 'kcnp'
    },
    locale: 'ko'
  }
];
