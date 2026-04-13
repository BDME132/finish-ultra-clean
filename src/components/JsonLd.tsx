type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

function blockKey(obj: Record<string, unknown>, index: number): string {
  const t = obj["@type"];
  if (typeof t === "string") return `${t}-${index}`;
  return `jsonld-${index}`;
}

export default function JsonLd({ data }: JsonLdProps) {
  const blocks = Array.isArray(data) ? data : [data];
  return (
    <>
      {blocks.map((obj, i) => (
        <script
          key={blockKey(obj, i)}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }}
        />
      ))}
    </>
  );
}
