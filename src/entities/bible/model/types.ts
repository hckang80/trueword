export interface TranslationBookInstance {
  translation: string;
  abbreviation: string;
  lang: string;
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
  lang: string;
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
