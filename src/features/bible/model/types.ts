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

export interface NewBibleBook {
  id: number;
  name: string;
  chapters: number;
  shortname: string;
  chapter_verses: Record<number, number>;
}

export interface BibleBook {
  bookid: number;
  name: string;
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

export interface NewVerseInstance {
  hash: string;
  disambiguation: unknown[];
  strongs: unknown[];
  paging: unknown[];
  errors: unknown[];
  error_level: number;
  results: NewVerses[];
}

export interface NewVerses {
  book_id: number;
  book_name: string;
  book_raw: string;
  chapter_verse: string;
  verses: Record<string, Record<string, NewVerse>>;
}
export interface NewVerse {
  book: number;
  chapter: number;
  claimed: boolean;
  id: number;
  italics: string;
  text: string;
  verse: number;
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

export interface NewBibleLanguage {
  errors: unknown[];
  error_level: number;
  results: Record<string, NewBibleTransition>;
}

export interface NewBibleTransition {
  name: string;
  shortname: string;
  module: string;
  year: string;
  owner: unknown;
  description: string;
  lang: string;
  lang_short: string;
  copyright: number;
  italics: number;
  strongs: number;
  red_letter: number;
  paragraph: number;
  rank: number;
  research: number;
  restrict: number;
  copyright_id: number;
  copyright_statement: string;
  rtl: number;
  lang_native: string;
  downloadable: boolean;
}

export interface BibleLanguage {
  id: string;
  language: string;
  translations: BibleTransition[];
}

export interface BibleTransition {
  short_name: string;
  full_name: string;
  year: string;
  dir?: 'rtl';
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
  verse: TodayVerseItem;
}

export interface TodayVerseItem {
  chapter: number;
  verse: number;
  name: string;
  text: string;
}
