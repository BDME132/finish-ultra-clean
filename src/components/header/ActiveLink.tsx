"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";

type LinkProps = ComponentProps<typeof Link>;

export default function ActiveLink({
  href,
  activeClass,
  inactiveClass,
  matchPrefix = false,
  className,
  children,
  ...rest
}: LinkProps & {
  activeClass: string;
  inactiveClass: string;
  matchPrefix?: boolean;
}) {
  const pathname = usePathname() ?? "/";
  const target = typeof href === "string" ? href : href.pathname ?? "";
  const isActive = matchPrefix ? pathname.startsWith(target) : pathname === target;

  return (
    <Link
      href={href}
      className={`${className ?? ""} ${isActive ? activeClass : inactiveClass}`.trim()}
      {...rest}
    >
      {children}
    </Link>
  );
}
