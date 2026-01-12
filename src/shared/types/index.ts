import type { CookieOptions } from '@supabase/ssr';

export interface ErrorResponse {
  message: string[];
  statusCode: number;
}

export type RouteProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export type SupabaseCookie = {
  name: string;
  value: string;
  options?: CookieOptions;
};
