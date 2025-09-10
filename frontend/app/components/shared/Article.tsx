export default function Article({ html }: { html: string }) {
  return (
    <div
      className='reading-content article-content'
      style={{
        color: 'rgba(68, 68, 68, 1)',
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
