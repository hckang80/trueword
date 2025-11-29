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
  // {
  //   url: 'https://www.christianitytoday.com/rss',
  //   name: {
  //     global: 'christianitytoday'
  //   },
  //   locale: 'en'
  // },
  // // 403 이슈로 인해 일시 제외
  // {
  //   url: 'https://www.thegospelcoalition.org/feed/',
  //   imageUrl: 'media.thegospelcoalition.org',
  //   name: {
  //     global: 'thegospelcoalition'
  //   },
  //   locale: 'en'
  // },
  // {
  //   url: 'https://www.gospeltoday.co.kr/rss/allArticle.xml',
  //   name: {
  //     native: '가스펠투데이',
  //     global: 'gospeltoday'
  //   },
  //   locale: 'ko'
  // },
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
  //   url: 'http://www.newsnjoy.or.kr/rss/allArticle.xml',
  //   name: {
  //     native: '뉴스앤조이',
  //     global: 'newsnjoy'
  //   },
  //   locale: 'ko'
  // }
  // {
  //   url: 'https://www.christiandaily.co.kr/rss/archives/all.xml',
  //   imageUrl: 'images.christiandaily.co.kr',
  //   name: {
  //     native: '기독일보',
  //     global: 'christiandaily'
  //   },
  //   locale: 'ko'
  // } // 서버에 올라가면 이미지 못 불러옴
  // {
  //   url: 'http://www.ecumenian.com/rss/allArticle.xml',
  //   // imageUrl: 'images.christiandaily.co.kr',
  //   name: {
  //     native: '에큐메니안',
  //     global: 'ecumenian'
  //   },
  //   locale: 'ko'
  // } // 인코딩 깨짐
  // {
  //   url: 'https://www.kcnp.com/rss',
  //   name: {
  //     native: '한국기독신문',
  //     global: 'kcnp'
  //   },
  //   locale: 'ko'
  // } RSS 피드 수집 거부
];
