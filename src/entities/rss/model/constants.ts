import { RSSFeed } from './types';

// config 설정과도 연관이 있으므로 업데이트 후 편집기를 재실행해야 반영됩니다.
export const RSS_FEEDS: RSSFeed[] = [
  {
    url: 'https://relevantmagazine.com/feed',
    imageUrl: 'i0.wp.com',
    name: {
      global: 'relevantmagazine'
    },
    locale: 'en'
  },
  {
    url: 'https://www.christianitytoday.com/rss',
    name: {
      global: 'christianitytoday'
    },
    locale: 'en'
  },
  {
    url: 'https://www.christiantoday.co.kr/rss',
    imageUrl: 'images.christiantoday.co.kr',
    name: {
      native: '크리스천투데이',
      global: 'christiantoday'
    },
    locale: 'ko'
  }
  // {
  //   url: 'https://www.kcnp.com/rss',
  //   name: {
  //     native: '한국기독신문',
  //     global: 'kcnp'
  //   },
  //   locale: 'ko'
  // }
];
