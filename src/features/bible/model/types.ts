import type { Locale } from '@/shared';

export interface TranslationBookInstance {
  translation: string;
  abbreviation: string;
  lang: Locale;
  language: string;
  direction: string;
  encoding: string;
  nr: number;
  name: string;
  url: string;
  sha: string;
}

export type TranslationBooks = Record<string, TranslationBookInstance>;

export interface BibleBook {
  bookid: number;
  name: string;
  chronorder: number;
  chapters: number;
}

export interface BibleChapterInstance {
  abbreviation: string;
  book_name: string;
  chapter: number;
  name: string;
}

export interface Book {
  name: string;
  nr: number;
  chapters: Chapter[];
}

export interface Chapter {
  chapter: number;
  name: string;
  verses: Verse[];
}

export interface Verse {
  pk: number;
  verse: number;
  text: string;
}

export interface TransitionVersion {
  abbreviation: string;
  description: string;
  lang: Locale;
  language: string;
  distribution_license: string;
  distribution_versification: string;
  url: string;
  sha: string;
  translation: string;
}

export interface BibleLanguage {
  id: string;
  language: string;
  translations: BibleTransition[];
}

export interface BibleTransition {
  short_name: string;
  full_name: string;
  updated: number;
}

export interface SelectedBook {
  bookNumber: number;
  book: string;
  chapter: number;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
}

export interface TodayVerse {
  lang: Locale;
  abbreviation: string;
  bookNumber: number;
  verse: {
    chapter: number;
    verse: number;
    name: string;
    text: string;
  };
}
