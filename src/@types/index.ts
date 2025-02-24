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
  distribution_versification: string;
  url: string;
  sha: string;
}

export const locales = ['en', 'ko'];
