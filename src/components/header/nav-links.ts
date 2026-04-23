export const primaryLinks = [
  { href: "/training", label: "Training" },
  { href: "/gear", label: "Gear" },
  { href: "/blog", label: "Blog" },
];

export const moreLinks = [
  { href: "/tools/pace-calculator", label: "Pace Calculator" },
  { href: "/tools/glossary", label: "Glossary" },
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/newsletter", label: "Newsletter" },
  { href: "/search", label: "Search" },
];

export function isMoreActive(pathname: string): boolean {
  return (
    pathname.startsWith("/tools") ||
    pathname.startsWith("/faq") ||
    pathname.startsWith("/about") ||
    pathname.startsWith("/contact") ||
    pathname.startsWith("/newsletter") ||
    pathname.startsWith("/search")
  );
}
