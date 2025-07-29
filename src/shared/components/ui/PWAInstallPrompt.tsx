'use client';

import { Button, Callout, Flex, Text } from '@radix-ui/themes';
import { useEffect, useState } from 'react';

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

  const calloutStyles = {
    position: 'fixed' as const,
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 1000,
    minWidth: '300px'
  };

  if (isPwaInstalled || !showInstallMessage) {
    return null;
  }

  if (isIOS && isSafari) {
    return (
      <Callout.Root size="1" style={calloutStyles}>
        <Flex gap="3" direction="column" align="center">
          <Text weight="bold">홈 화면에 추가하여 앱처럼 사용해보세요!</Text>
          <Text size="2" align="center">
            하단의 <span style={{ fontSize: '1.2em', verticalAlign: 'middle' }}>↗️</span> 공유
            버튼을 누르고 '<span style={{ fontWeight: 'bold' }}>홈 화면에 추가</span>'를
            선택해주세요.
          </Text>
        </Flex>
      </Callout.Root>
    );
  }

  return (
    <Callout.Root size="1" style={calloutStyles}>
      <Flex gap="3" align="center" justify="between">
        <Text>저희 앱을 설치하고 더 편리하게 사용해보세요!</Text>
        <Button size="1" onClick={handleInstallClick}>
          앱 설치
        </Button>
      </Flex>
    </Callout.Root>
  );
}
