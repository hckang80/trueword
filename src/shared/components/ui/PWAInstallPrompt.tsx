'use client';

import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallMessage, setShowInstallMessage] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const t = useTranslations('Home');

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream);
      setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);
    }
  }, []);

  const handleInstallClick = useCallback(async () => {
    if (!deferredPrompt) return;
    setShowInstallMessage(false);
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      toast(t('pwa.success'));
      setIsStandalone(true);
    }
    setDeferredPrompt(null);
  }, [deferredPrompt, setShowInstallMessage, setDeferredPrompt, t]);

  useEffect(() => {
    if (!isClient || isStandalone) return;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallMessage(true);
    };

    const handleAppInstalled = () => {
      setShowInstallMessage(false);
      setDeferredPrompt(null);
      toast(t('pwa.success'));
      setIsStandalone(true);
    };

    if (isIOS) {
      setShowInstallMessage(true);
    } else {
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.addEventListener('appinstalled', handleAppInstalled);
    }

    return () => {
      if (!isIOS) {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
      }
    };
  }, [isClient, isStandalone, isIOS, deferredPrompt, t]);

  useEffect(() => {
    if (!showInstallMessage || isStandalone) return;

    if (isIOS) {
      toast.info(t('pwa.iosTitle'), {
        description: t('pwa.iosDescription'),
        duration: 30 * 1000
      });
    } else {
      toast.info('', {
        description: t('pwa.androidDescription'),
        action: {
          label: t('pwa.install'),
          onClick: handleInstallClick
        },
        duration: 10 * 1000
      });
    }
  }, [showInstallMessage, isIOS, handleInstallClick, t, isStandalone]);

  return null;
}
