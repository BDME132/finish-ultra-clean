import { profileInitials, type AccountProfile } from "@/lib/account/profile";

type AvatarSubject = Pick<AccountProfile, "display_name" | "username" | "avatar_url">;

const SIZES = {
  xs: "w-6 h-6 text-[10px]",
  sm: "w-8 h-8 text-xs",
  md: "w-12 h-12 text-sm",
  lg: "w-20 h-20 text-xl",
  xl: "w-28 h-28 text-2xl",
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
  const sizeClasses = SIZES[size];
  const initials = profile ? profileInitials(profile) : "?";

  if (profile?.avatar_url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={profile.avatar_url}
        alt={profile.display_name || profile.username || "Avatar"}
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
