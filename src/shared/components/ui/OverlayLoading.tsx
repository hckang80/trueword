import { Loading } from './Loading';

export function OverlayLoading() {
  return (
    <div className='fixed z-50 inset-0 bg-[#00000080]'>
      <Loading />
    </div>
  );
}
