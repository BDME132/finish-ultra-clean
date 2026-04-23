import Image from "next/image";
import { profileInitials, type AccountProfile } from "@/lib/account/profile";

type AvatarSubject = Pick<AccountProfile, "display_name" | "username" | "avatar_url">;

const SIZES = {
  xs: { classes: "w-6 h-6 text-[10px]", px: 24 },
  sm: { classes: "w-8 h-8 text-xs", px: 32 },
  md: { classes: "w-12 h-12 text-sm", px: 48 },
  lg: { classes: "w-20 h-20 text-xl", px: 80 },
  xl: { classes: "w-28 h-28 text-2xl", px: 112 },
} as const;

export type AvatarSize = keyof typeof SIZES;

export default function Avatar({
  profile,
  size = "md",
  className = "",
}: {
  profile: AvatarSubject | null | undefined;
  size?: AvatarSize;
  className?: string;
}) {
  const { classes: sizeClasses, px } = SIZES[size];
  const initials = profile ? profileInitials(profile) : "?";

  if (profile?.avatar_url) {
    return (
      <Image
        src={profile.avatar_url}
        alt={profile.display_name || profile.username || "Avatar"}
        width={px}
        height={px}
        unoptimized
        className={`${sizeClasses} rounded-full object-cover bg-gray-100 ${className}`}
      />
    );
  }

  return (
    <span
      className={`${sizeClasses} rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center ${className}`}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}
