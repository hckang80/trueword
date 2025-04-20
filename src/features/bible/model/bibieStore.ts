import type { SelectedBook, TransitionVersion } from '@/entities/bible';
import { create } from 'zustand';

interface BibleStore {
  selectedTranslationVersion?: TransitionVersion;
  setSelectedTranslationVersion: (transitionVersion: TransitionVersion) => void;
  selectedBookInstance: SelectedBook;
  setSelectedBookInstance: (instance: Partial<SelectedBook>) => void;
}

export const useBibleStore = create<BibleStore>((set, get) => ({
  selectedTranslationVersion: undefined,
  setSelectedTranslationVersion: (transitionVersion) => {
    set({ selectedTranslationVersion: transitionVersion });
  },
  selectedBookInstance: {
    book: '',
    chapter: 0
  },
  setSelectedBookInstance: (instance: Partial<SelectedBook>) => {
    const { selectedBookInstance } = get();
    set({ selectedBookInstance: { ...selectedBookInstance, ...instance } });
  }
}));
