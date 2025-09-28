// app/head.tsx
export default function Head() {
  return (
    <>
      <meta charSet='utf-8' />
      <meta
        name='viewport'
        content='width=device-width, initial-scale=1.0, user-scalable=no'
      />
      {/* Favicon */}
      <link rel='icon' type='image/svg+xml' href='/favicon.svg' />
      <link rel='icon' type='image/png' href='/favicon.png' />
      <link rel='shortcut icon' href='/favicon.ico' />
      <link rel='apple-touch-icon' href='/favicon.png' />
    </>
  );
}
