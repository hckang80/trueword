'use client';

import { Button } from '@/shared';
import { createClient } from '@/shared/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-6 h-6">
    <path
      fill="#FFC107"
      d="M43.611 20.083H42V20H24v8h11.303c-1.615 4.965-6.197 8.527-11.303 8.527-7.33 0-13.3-5.933-13.3-13.256s5.97-13.256 13.3-13.256c3.151 0 5.86 1.157 8.016 3.013l5.656-5.656C34.046 6.096 29.412 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20c11.045 0 20-8.955 20-20z"
    />
    <path
      fill="#FF3D00"
      d="M6.306 14.691L11.758 19.1c1.378-2.607 4.14-4.598 7.242-4.598C22.614 14.502 26.1 16.7 28 19.689L34.1 13.596C30.672 10.377 26.046 8.5 20.732 8.5C14.004 8.5 8.243 12.396 6.306 14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24 44c5.111 0 9.873-1.872 13.486-5.198L31.621 32.61a13.313 13.313 0 01-7.621 2.392c-5.11 0-9.45-3.327-11.238-8.156L4.764 36.314C7.947 40.85 15.65 44 24 44z"
    />
    <path
      fill="#1976D2"
      d="M43.611 20.083H42V20H24v8h11.303c-1.615 4.965-6.197 8.527-11.303 8.527-7.33 0-13.3-5.933-13.3-13.256s5.97-13.256 13.3-13.256c3.151 0 5.86 1.157 8.016 3.013l5.656-5.656C34.046 6.096 29.412 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20c11.045 0 20-8.955 20-20z"
    />
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
        className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border border-gray-300 rounded-lg shadow-sm text-gray-700 font-semibold hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <GoogleIcon />
        Google로 로그인
      </button>

      <Button onClick={handleLogout}>LOGOUT</Button>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}
