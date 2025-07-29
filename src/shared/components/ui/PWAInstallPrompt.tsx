'use client';

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

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

  useEffect(() => {
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
      alert('PWA가 설치되었습니다! 이제 앱처럼 사용해보세요.');
    };

    if (isIOS && isSafari) {
      setShowInstallMessage(true);
    } else {
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.addEventListener('appinstalled', handleAppInstalled);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isStandalone, isIOS, isSafari]);

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

  if (isPwaInstalled || !showInstallMessage) {
    return null;
  }

  if (isIOS && isSafari) {
    toast.info('홈 화면에 추가하여 앱처럼 사용해보세요!', {
      description: '하단의 ↗️ 공유 버튼을 누르고 "홈 화면에 추가"를 선택해주세요',
      duration: 10 * 1000
    });
    return null;
  }

  toast.info('', {
    description: '저희 앱을 설치하고 더 편리하게 사용해보세요!',
    action: {
      label: 'Download',
      onClick: () => handleInstallClick()
    },
    duration: 10 * 1000
  });
}
