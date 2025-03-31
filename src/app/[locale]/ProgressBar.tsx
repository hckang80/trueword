'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { isClient } from '@/shared';

NProgress.configure({ showSpinner: false });

export default function ProgressBar() {
  if (isClient() && !NProgress.isStarted()) {
    NProgress.start();
  }

  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const timer = setTimeout(() => NProgress.done(), 500);
    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return null;
}
