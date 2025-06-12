export interface ErrorResponse {
  message: string[];
  statusCode: number;
}

export type RouteProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};
