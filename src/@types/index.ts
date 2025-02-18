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
