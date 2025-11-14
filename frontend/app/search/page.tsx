import { Suspense } from 'react';
import SearchPage from '../components/pc/SearchPage';
import { getDeviceTypeFromHeaders } from '../utils/serverDeviceUtils';

export default async function page() {
  const deviceType = await getDeviceTypeFromHeaders();
  const isMobile = deviceType === 'mobile';
  return (
    <Suspense fallback={null}>
      <SearchPage isMobile={isMobile} />
    </Suspense>
  );
}
