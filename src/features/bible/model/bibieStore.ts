import { create } from 'zustand';

interface BibleStore {
  bibleLanguage: string;
  setBibleLanguage: (language: string) => void;
}

export const useBibleStore = create<BibleStore>((set) => ({
  bibleLanguage: '',
  setBibleLanguage: (language: string) => {
    set({ bibleLanguage: language });
  }
}));
