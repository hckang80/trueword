export function isClient(): boolean {
  return typeof window === 'object';
}
