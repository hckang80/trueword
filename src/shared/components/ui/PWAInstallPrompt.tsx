'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isPwaInstalled, setIsPwaInstalled] = useState(false);
  const [showInstallMessage, setShowInstallMessage] = useState(false);

  const [isIOS, setIsIOS] = useState(false);
  const [isSafari, setIsSafari] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const t = useTranslations('Home');

  useEffect(() => {
    setIsClient(true);

    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream);
      setIsSafari(/^((?!chrome|android).)*safari/i.test(navigator.userAgent));
      setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);
    }
  }, []);

  useEffect(() => {
    if (!isClient) return;

    if (isStandalone) {
      setIsPwaInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallMessage(true);
    };

    const handleAppInstalled = () => {
      setIsPwaInstalled(true);
      setShowInstallMessage(false);
      setDeferredPrompt(null);
      toast(t('pwa.success'));
    };

    if (isIOS && isSafari) {
      setShowInstallMessage(true);
    } else {
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.addEventListener('appinstalled', handleAppInstalled);
    }

    return () => {
      if (!isIOS || !isSafari) {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
      }
    };
  }, [isClient, isStandalone, isIOS, isSafari, deferredPrompt]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    setShowInstallMessage(false);
    await deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setIsPwaInstalled(true);
    }

    setDeferredPrompt(null);
  };

  if (!isClient || isPwaInstalled || !showInstallMessage) {
    return null;
  }

  if (isIOS && isSafari) {
    toast.info(t('pwa.iosTitle'), {
      description: t('pwa.iosDescription'),
      duration: 30 * 1000
    });
    return null;
  }

  toast.info('', {
    description: t('pwa.androidDescription'),
    action: {
      label: t('pwa.install'),
      onClick: () => handleInstallClick()
    },
    duration: 10 * 1000
  });

  return null;
}
