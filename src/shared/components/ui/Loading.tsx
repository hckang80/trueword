import { LoaderCircle } from 'lucide-react';

export function Loading() {
  return (
    <div className="center-absolute">
      <LoaderCircle className="animate-spin" />
    </div>
  );
}
