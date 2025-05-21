'use client';

import { cn } from '@/shared';
import { Button } from '@/shared/components/system/button';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription
} from '@/shared/components/system/drawer';
import { Globe } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useUpdateBibleParams } from '../hooks';
import type { TransitionVersion, BibleChapterInstance } from '../model';
import { BibleLanguages } from '..';

function TranslationSelector({
  localizedTranslationVersions,
  bibleChapterInstance
}: {
  localizedTranslationVersions: TransitionVersion[];
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
  const { distribution_versification: label } =
    localizedTranslationVersions.find((version) => version.abbreviation === abbreviation) ||
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
              {localizedTranslationVersions.map(
                ({ distribution_versification, abbreviation, description }) => (
                  <li key={abbreviation}>
                    <button
                      className={cn('w-full p-[10px] text-left')}
                      onClick={() => handleTranslationVersionChange(abbreviation)}
                    >
                      <em
                        className={cn(
                          'block text-[16px]',
                          abbreviation === bibleChapterInstance.abbreviation ? 'font-bold' : ''
                        )}
                      >
                        {distribution_versification}
                      </em>
                      <span className="block text-[13px]">{description}</span>
                    </button>
                  </li>
                )
              )}
            </ul>
          </DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
}

export default TranslationSelector;
