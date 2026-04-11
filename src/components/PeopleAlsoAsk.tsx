import Link from "next/link";

interface AskItem {
  question: string;
  href: string;
}

interface Props {
  items: AskItem[];
}

export default function PeopleAlsoAsk({ items }: Props) {
  return (
    <section className="py-12 border-t border-gray-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-headline text-xl font-bold text-dark mb-4">People Also Ask</h2>
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="text-primary hover:underline text-sm font-medium leading-relaxed"
              >
                {item.question}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
