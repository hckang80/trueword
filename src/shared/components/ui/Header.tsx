'use client';

import { useBibleParams } from '@/features/bible';
import {
  Button,
  ModeToggle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared';
import { usePathname } from '@/shared/i18n/routing';
import { Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const languages = ['ko', 'en'];

export function Header() {
  const router = useRouter();
  const { locale } = useBibleParams();
  const pathname = usePathname();

  const handleChange = (language: string) => {
    router.push(`/${language}${pathname}`);
  };

  return (
    <header className="guide-line-layout flex justify-end gap-[4px] pl-[var(--global-inset)] pr-[var(--global-inset)] pt-[10px] pb-[10px] text-right">
      <h1 className="mr-auto uppercase text-3xl font-bold shimmer-text">True Word</h1>
      <Select value={locale} onValueChange={handleChange}>
        <SelectTrigger className="w-[80px]">
          <SelectValue placeholder="Select a language" />
        </SelectTrigger>
        <SelectContent>
          {languages.map((language) => (
            <SelectItem value={language} key={language}>
              {language.toUpperCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button variant="ghost" size="icon" asChild>
        <Link href="#">{locale}</Link>
      </Button>
      <Button variant="outline" size="icon" asChild>
        <a href="mailto:hckang80@gmail.com">
          <Mail />
          <span className="sr-only">Send mail</span>
        </a>
      </Button>
      <ModeToggle />
    </header>
  );
}
