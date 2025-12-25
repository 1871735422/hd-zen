'use server';

import { headers } from 'next/headers';

import {
  getDeviceTypeFromHeaders,
  isMobileFromClientHints,
  isMobileUserAgent,
} from '../../utils/serverDeviceUtils';

export default async function DeviceDebugPage() {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';
  const deviceType = await getDeviceTypeFromHeaders();
  const isMobileUA = isMobileUserAgent(userAgent);
  const mobileFromHints = isMobileFromClientHints(headersList);

  const data = {
    deviceType,
    userAgent,
    isMobileUA,
    mobileFromHints,
    headers: {
      'sec-ch-ua': headersList.get('sec-ch-ua'),
      'sec-ch-ua-mobile': headersList.get('sec-ch-ua-mobile'),
      'sec-ch-ua-platform': headersList.get('sec-ch-ua-platform'),
      'sec-ch-width': headersList.get('sec-ch-width'),
      'sec-ch-viewport-width': headersList.get('sec-ch-viewport-width'),
      'sec-ch-viewport-height': headersList.get('sec-ch-viewport-height'),
    },
  };

  return (
    <pre
      style={{
        padding: 16,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-all',
      }}
    >
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}
