'use client';

import {
  Button,
  locales,
  ModeToggle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared';
import { Link, usePathname } from '@/shared/i18n/routing';
import { Mail } from 'lucide-react';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import { useRouter } from 'nextjs-toploader/app';

export function Header() {
  const router = useRouter();
  const locale = useLocale();
  const pathname = usePathname();

  const handleChange = (language: string) => {
    router.push(`/${language}${pathname}`);
  };

  return (
    <header className="guide-line-layout flex justify-end gap-[4px] pl-[var(--global-inset)] pr-[var(--global-inset)] pt-[10px] pb-[10px]">
      <h1 className="mr-auto uppercase text-3xl font-bold shimmer-text whitespace-nowrap">
        <Image
          src="/logo.jpeg"
          width="100"
          height="100"
          alt="true word"
          className="sr-only"
        ></Image>
        <Link href="/home">True Word</Link>
      </h1>
      <Select value={locale} onValueChange={handleChange}>
        <SelectTrigger className="w-[80px]">
          <SelectValue placeholder="Select a language" />
        </SelectTrigger>
        <SelectContent>
          {locales.map((language) => (
            <SelectItem value={language} key={language}>
              {language.toUpperCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
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
