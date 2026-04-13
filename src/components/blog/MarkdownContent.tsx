import type { ReactNode } from "react";
import Link from "next/link";

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];
    if (token.startsWith("**") && token.endsWith("**")) {
      nodes.push(
        <strong key={`${match.index}-bold`} className="font-semibold text-dark">
          {token.slice(2, -2)}
        </strong>,
      );
    } else {
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        const [, label, href] = linkMatch;
        const isExternal = href.startsWith("http");
        nodes.push(
          isExternal ? (
            <a
              key={`${match.index}-link`}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2"
            >
              {label}
            </a>
          ) : (
            <Link
              key={`${match.index}-link`}
              href={href}
              className="text-primary underline underline-offset-2"
            >
              {label}
            </Link>
          ),
        );
      } else {
        nodes.push(token);
      }
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

function renderBlock(block: string, index: number) {
  if (block.startsWith("## ")) {
    return (
      <h2
        key={index}
        className="font-headline text-2xl font-bold text-dark mt-10 mb-4"
      >
        {block.replace("## ", "")}
      </h2>
    );
  }

  if (block.startsWith("### ")) {
    return (
      <h3
        key={index}
        className="font-headline text-xl font-bold text-dark mt-8 mb-3"
      >
        {block.replace("### ", "")}
      </h3>
    );
  }

  if (block.startsWith("1. ") || block.startsWith("- ")) {
    const ordered = block.startsWith("1. ");
    const items = block.split("\n");
    const Tag = ordered ? "ol" : "ul";

    return (
      <Tag
        key={index}
        className={`${ordered ? "list-decimal" : "list-disc"} pl-6 space-y-2 text-gray leading-relaxed my-4`}
      >
        {items.map((item, itemIndex) => (
          <li key={`${index}-${itemIndex}`}>
            {renderInline(
              item.replace(/^[\d]+\.\s*/, "").replace(/^-\s*/, ""),
            )}
          </li>
        ))}
      </Tag>
    );
  }

  return (
    <p key={index} className="text-gray leading-relaxed my-4">
      {renderInline(block)}
    </p>
  );
}

export default function MarkdownContent({
  markdown,
  className = "",
}: {
  markdown: string;
  className?: string;
}) {
  return (
    <div className={className}>
      {markdown
        .split("\n\n")
        .filter(Boolean)
        .map((block, index) => renderBlock(block, index))}
    </div>
  );
}
