export interface BibleInstance {
  books: Book[];
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

export interface Transition {
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

export const locales = ['en', 'ko'];

export interface SelectedBook {
  book: string;
  chapter: number;
}
