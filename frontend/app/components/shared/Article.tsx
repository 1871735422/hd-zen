export default function Article({ html }: { html: string }) {
  return (
    <div
      style={{
        color: 'rgba(68, 68, 68, 1)',
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
