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

export interface BibleChapterInstance {
  abbreviation: string;
  book_nr: number;
  book_name: string;
  chapter: number;
  name: string;
  verses: Verse[];
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
  chapter: number;
  name: string;
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
  translation: Locale;
  abbreviation: string;
  bookNumber: number;
  verse: Verse;
}
