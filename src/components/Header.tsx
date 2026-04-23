import Link from "next/link";
import HeaderShell from "./header/HeaderShell";
import ActiveLink from "./header/ActiveLink";
import MoreDropdown from "./header/MoreDropdown";
import AICoachButton from "./header/AICoachButton";
import UserMenu from "./header/UserMenu";
import MobileMenu from "./header/MobileMenu";
import { primaryLinks } from "./header/nav-links";

const PRIMARY_ACTIVE = "text-primary border-b-2 border-accent";
const PRIMARY_INACTIVE = "text-dark hover:text-primary border-b-2 border-transparent";
const PRIMARY_BASE = "text-sm font-medium transition-colors pb-0.5";

export default function Header() {
  return (
    <HeaderShell>
      <Link href="/" className="font-headline text-2xl font-bold text-primary">
        FinishUltra
      </Link>

      <nav className="hidden md:flex items-center gap-6">
        {primaryLinks.map((link) => (
          <ActiveLink
            key={link.href}
            href={link.href}
            matchPrefix
            className={PRIMARY_BASE}
            activeClass={PRIMARY_ACTIVE}
            inactiveClass={PRIMARY_INACTIVE}
          >
            {link.label}
          </ActiveLink>
        ))}

        <MoreDropdown />

        <AICoachButton />

        <ActiveLink
          href="/race-hq"
          matchPrefix
          className={PRIMARY_BASE}
          activeClass={PRIMARY_ACTIVE}
          inactiveClass={PRIMARY_INACTIVE}
        >
          Dashboard
        </ActiveLink>

        <UserMenu />
      </nav>

      <MobileMenu />
    </HeaderShell>
  );
}
