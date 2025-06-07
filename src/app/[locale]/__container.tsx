'use client';

import { useBibleToday } from '@/features/bible';
import { Link } from '@/shared/i18n/routing';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import type { UrlObject } from 'url';

export default function MainContainer() {
  const { locale } = useParams<{ locale: string }>();
  const mainStyle = {
    backgroundColor: '#222',
    color: '#EEE',
    padding: '20px',
    fontFamily: 'sans-serif' // 기본 폰트 설정
  };

  const sectionStyle = {
    marginBottom: '20px',
    paddingBottom: '15px',
    borderBottom: '1px solid #555'
  };

  const headingStyle = {
    color: '#FFF',
    marginTop: '0'
  };

  const linkStyle = {
    color: '#89CFF0',
    textDecoration: 'none'
  };

  const newsLinkStyle = {
    color: '#EEE',
    textDecoration: 'none'
  };

  const fixedNavStyle = {
    position: 'fixed',
    bottom: '20px',
    right: '20px'
  };

  const navLinkStyle = {
    color: '#EEE',
    textDecoration: 'none',
    marginLeft: '10px'
  };

  const {
    data: { verse, ...restData }
  } = useBibleToday(locale);

  const moreTodayWord: UrlObject = {
    pathname: '/bible',
    query: {
      ...restData,
      chapterNumber: verse.chapter,
      verseNumber: verse.verse
    }
  };

  const t = useTranslations('Home');

  return (
    <div style={mainStyle}>
      <div style={sectionStyle}>
        <h2 style={headingStyle}>{t('todaysVerse')}</h2>
        <p style={{ fontSize: '1.2em', color: '#FFF' }}>{verse.name}</p>
        <p>{verse.text}</p>
        <Link href={moreTodayWord} style={linkStyle}>
          {t('viewFullContext')}
        </Link>
      </div>

      <div style={sectionStyle}>
        <h2 style={headingStyle}>최신 뉴스</h2>
        <ul>
          <li>
            <a href="#" style={newsLinkStyle}>
              속보: [뉴스 제목 1]
            </a>
          </li>
          <li>
            <a href="#" style={newsLinkStyle}>
              주요: [뉴스 제목 2]
            </a>
          </li>
          <li>
            <a href="#" style={newsLinkStyle}>
              [뉴스 제목 3]
            </a>
          </li>
        </ul>
        <a href="#" style={linkStyle}>
          더 많은 뉴스 보기
        </a>
      </div>

      <div>
        <h2 style={headingStyle}>빠른 링크</h2>
        <p>
          <a href="#" style={(newsLinkStyle, { marginRight: '10px' })}>
            성경 검색
          </a>
          <a href="#" style={(newsLinkStyle, { marginRight: '10px' })}>
            인물 이야기
          </a>
        </p>
      </div>

      <div style={fixedNavStyle}>
        <a href="#" style={navLinkStyle}>
          설정
        </a>
        <a href="#" style={navLinkStyle}>
          뉴스
        </a>
        <a href="#" style={navLinkStyle}>
          성경
        </a>
      </div>
    </div>
  );
}
