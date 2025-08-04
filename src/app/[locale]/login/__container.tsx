'use client';

import { Button } from '@/shared';
import { createClient } from '@/shared/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { CredentialResponse } from 'google-one-tap';
import { useEffect, useState } from 'react';

export default function LoginContainer({
  nonce,
  hashedNonce
}: {
  nonce: string;
  hashedNonce: string;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    checkUser();

    // onAuthStateChange 리스너를 설정하여 실시간으로 인증 상태 변화를 감지합니다.
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);
      setUser(session?.user ?? null);
    });

    // Google One Tap 콜백 함수를 window 객체에 전역적으로 등록합니다.
    window.handleSignInWithGoogle = async (response: CredentialResponse) => {
      // Google에서 받은 credential을 사용하여 Supabase에 로그인합니다.
      console.log({ response });
      const { error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: response.credential,
        nonce
      });
      if (error) {
        console.error('Google One Tap login error:', error);
        console.log('로그인에 실패했습니다. 콘솔을 확인해주세요.');
      }
    };

    // 컴포넌트 언마운트 시 리스너와 전역 콜백 함수를 해제합니다.
    return () => {
      subscription.unsubscribe();
      delete window.handleSignInWithGoogle;
    };
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error);
      console.log('로그아웃에 실패했습니다.');
    } else {
      console.log('로그아웃 되었습니다.');
    }
  };

  return (
    <>
      <div
        id="g_id_onload"
        data-client_id={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
        data-context="signin"
        data-ux_mode="popup"
        data-callback="handleSignInWithGoogle"
        data-nonce={hashedNonce}
        data-auto_select="true"
        data-itp_support="true"
        data-use_fedcm_for_prompt="true"
      ></div>
      <div
        className="g_id_signin"
        data-type="standard"
        data-shape="pill"
        data-theme="outline"
        data-text="signin_with"
        data-size="large"
        data-logo_alignment="left"
      ></div>
      <Button onClick={handleLogout}>LOGOUT</Button>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </>
  );
}
