'use client';

import { GoogleIcon } from '@/shared/assets';
import { Button } from '@/shared/components';
import { createClient } from '@/shared/lib/supabase/client';
import { Flex } from '@radix-ui/themes';
import { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { TextAnimation } from './TextAnimation';

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
      toast.info('You have been logged out.');
    }
  };

  return (
    <Flex
      direction='column'
      justify='center'
      gap='2'
      className='absolute guide-line-layout inset-y-0'
    >
      {process.env.NODE_ENV}
      <TextAnimation />
      <span className='sr-only'>{user?.user_metadata.full_name}</span>
      <button
        onClick={handleGoogleLogin}
        className='w-full flex items-center justify-center gap-3 px-6 py-3 dark:bg-white bg-black dark:text-black text-white rounded-sm shadow-sm font-semibold'
      >
        <GoogleIcon />
        Sign in with Google
      </button>

      {!!user && (
        <Flex justify='center'>
          <Button variant='link' onClick={handleLogout}>
            LOGOUT
          </Button>
        </Flex>
      )}
    </Flex>
  );
}
