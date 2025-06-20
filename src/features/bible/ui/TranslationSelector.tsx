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
import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useTranslationVersions, useUpdateBibleParams } from '../hooks';

function TranslationSelector() {
  const t = useTranslations('Common');
  const [open, setOpen] = useState(false);

  const updateBibleParams = useUpdateBibleParams();

  const handleTranslationVersionChange = (abbreviation: string, id: string) => {
    updateBibleParams({ abbreviation, language: id });
  };

  const searchParams = useSearchParams();
  const abbreviation = searchParams.get('abbreviation');
  const translationLanguage = searchParams.get('translation');

  const { data: translationVersions } = useTranslationVersions();

  const detailsRefs = useRef<Record<number, HTMLDetailsElement | null>>({});
  const timeoutRefs = useRef<Record<number, NodeJS.Timeout | null>>({});

  const selectedTranslationVersionItem = (short_name: string) => short_name === abbreviation;

  const adjustPosition = (index: number) => {
    const details = detailsRefs.current[index];
    if (!details || !details.open) return;

    const viewportHeight = window.innerHeight;
    let rect: DOMRect | null = null;
    let timeout = timeoutRefs.current[index];

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      rect = details.getBoundingClientRect();

      const isOutside = rect.bottom > viewportHeight;

      if (isOutside) {
        details.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }

      timeout = null;
    }, 100);
  };

  useEffect(() => {
    setOpen(false);
  }, [abbreviation]);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">{abbreviation}</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="p-0">
          <DrawerTitle className="hidden">Translations</DrawerTitle>
          <DrawerDescription asChild>
            <div>
              {translationVersions.map(({ id, language, translations }, index) => (
                <details
                  name="translationVersions"
                  ref={(el) => {
                    detailsRefs.current[index] = el;
                  }}
                  key={id}
                  className="group transition-[max-height] duration-400 ease-in-out max-h-[80px] open:max-h-[8000px]"
                  onToggle={() => adjustPosition(index)}
                >
                  <summary
                    className={cn(
                      'flex justify-between p-[10px]',
                      id === translationLanguage ? 'font-bold' : ''
                    )}
                  >
                    {language}
                    <ChevronDown size={20} className="transition group-open:rotate-180" />
                  </summary>
                  <div className="grid grid-cols-5 gap-[4px] px-[10px]">
                    {translations.map(({ short_name }) => (
                      <Button
                        key={short_name}
                        variant="outline"
                        disabled={selectedTranslationVersionItem(short_name)}
                        onClick={() => {
                          handleTranslationVersionChange(short_name, id);
                        }}
                      >
                        {short_name}
                      </Button>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
}

export default TranslationSelector;
