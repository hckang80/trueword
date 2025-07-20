import { LoaderCircle } from 'lucide-react';

export function Loading() {
  return (
    <div className="fixed z-50 inset-0 bg-[#00000080]">
      <LoaderCircle className="animate-spin center-absolute" />
    </div>
  );
}
