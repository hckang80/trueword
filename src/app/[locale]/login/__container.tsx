'use client';

import { Button, GoogleIcon } from '@/shared';
import { createClient } from '@/shared/lib/supabase/client';
import { Flex, Grid } from '@radix-ui/themes';
import { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

export default function LoginContainer() {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
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
    } else {
      console.log('로그아웃 되었습니다.');
    }
  };

  return (
    <Grid gap="2">
      <span className="sr-only">{user?.user_metadata.full_name}</span>
      <button
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-3 px-6 py-3 dark:bg-white bg-black dark:text-black text-white rounded-sm shadow-sm font-semibold"
      >
        <GoogleIcon />
        Sign in with Google
      </button>

      <Flex justify="center">
        <Button variant="link" onClick={handleLogout}>
          LOGOUT
        </Button>
      </Flex>
    </Grid>
  );
}
