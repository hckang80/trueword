'use client';

import {
  cn,
  Button,
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription
} from '@/shared';
import { Globe } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useUpdateBibleParams } from '../hooks';
import type { BibleTransition, BibleChapterInstance } from '../model';
import { BibleLanguages } from '..';

function TranslationSelector({
  localizedTranslationVersions,
  bibleChapterInstance
}: {
  localizedTranslationVersions: BibleTransition[];
  bibleChapterInstance: BibleChapterInstance;
}) {
  const t = useTranslations('Common');
  const [open, setOpen] = useState(false);

  const updateBibleParams = useUpdateBibleParams();

  const handleTranslationVersionChange = (abbreviation: string) => {
    updateBibleParams({ abbreviation });
  };

  const searchParams = useSearchParams();
  const abbreviation = searchParams.get('abbreviation');
  const { short_name: label } =
    localizedTranslationVersions.find((version) => version.short_name === abbreviation) ||
    localizedTranslationVersions[0];

  useEffect(() => {
    setOpen(false);
  }, [abbreviation]);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">{label}</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="p-0">
          <div className="flex items-center justify-between p-[10px]">
            <span className="flex items-center gap-[4px] capitalize">
              <Globe />
              {t('language')}
            </span>
            <div className="flex items-center gap-[4px]">
              <BibleLanguages />
            </div>
          </div>
          <DrawerTitle className="hidden">Translations</DrawerTitle>
          <DrawerDescription asChild>
            <ul>
              {localizedTranslationVersions.map(({ full_name, short_name, updated }) => (
                <li key={short_name}>
                  <button
                    className={cn('w-full p-[10px] text-left')}
                    onClick={() => handleTranslationVersionChange(short_name)}
                  >
                    <em
                      className={cn(
                        'block text-[16px]',
                        short_name === bibleChapterInstance.abbreviation ? 'font-bold' : ''
                      )}
                    >
                      {full_name}
                    </em>
                    <span className="block text-[13px]">{updated}</span>
                  </button>
                </li>
              ))}
            </ul>
          </DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
}

export default TranslationSelector;
