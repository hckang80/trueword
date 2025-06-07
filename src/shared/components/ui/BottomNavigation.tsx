'use client';

import { Home, Book, Newspaper } from 'lucide-react';
import { Link, usePathname } from '@/shared/i18n/routing';
import { useTranslations } from 'next-intl';

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  text: string;
  isActive: boolean;
}

const NavItem = ({ href, icon, text, isActive }: NavItemProps) => {
  return (
    <Link
      href={href}
      className={`flex flex-col grow h-[var(--navbar-height)] justify-center items-center ${
        isActive ? 'text-primary' : 'text-gray-400'
      }`}
    >
      <div className="mb-1">{icon}</div>
      <span className="text-xs font-medium capitalize">{text}</span>
    </Link>
  );
};

export const BottomNavigation = () => {
  const t = useTranslations('Common');
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname.startsWith(path);
  };

  return (
    <nav className="global-nav fixed bottom-0 left-0 right-0 bg-[var(--color-background)] border-t border-gray-200 shadow-lg">
      <div className="guide-line-layout flex items-center justify-around">
        <NavItem
          href="/"
          icon={<Home size={24} className={isActive('/') ? 'text-primary' : 'text-gray-400'} />}
          text={t('home')}
          isActive={isActive('/')}
        />
        <NavItem
          href="/bible"
          icon={
            <Book size={24} className={isActive('/bible') ? 'text-primary' : 'text-gray-400'} />
          }
          text={t('bible')}
          isActive={isActive('/bible')}
        />
        <NavItem
          href="/news"
          icon={
            <Newspaper size={24} className={isActive('/news') ? 'text-primary' : 'text-gray-400'} />
          }
          text={t('news')}
          isActive={isActive('/news')}
        />
      </div>
    </nav>
  );
};
