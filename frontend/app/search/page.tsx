import { Suspense } from 'react';
import SearchPage from '../components/pc/SearchPage';

export default function page() {
  return (
    <Suspense fallback={null}>
      <SearchPage />
    </Suspense>
  );
}
