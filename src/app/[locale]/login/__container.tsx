'use client';

import { Button } from '@/shared';
import { createClient } from '@/shared/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

const GoogleIcon = () => (
  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-6 h-6">
    <path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
    ></path>
    <path
      fill="#4285F4"
      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
    ></path>
    <path
      fill="#FBBC05"
      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
    ></path>
    <path
      fill="#34A853"
      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
    ></path>
    <path fill="none" d="M0 0h48v48H0z"></path>
  </svg>
);

export default function LoginContainer({
  nonce,
  hashedNonce
}: {
  nonce: string;
  hashedNonce: string;
}) {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  // Google OAuth 로그인 핸들러
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      // provider: 'google',
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`
      }
    });
    if (error) {
      console.error('Google OAuth login error:', error);
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
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
    <div>
      <button
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-3 px-6 py-3 dark:bg-white bg-black dark:text-black text-white rounded-sm shadow-sm font-semibold"
      >
        <GoogleIcon />
        Sign in with Google
      </button>

      <Button onClick={handleLogout}>LOGOUT</Button>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}
