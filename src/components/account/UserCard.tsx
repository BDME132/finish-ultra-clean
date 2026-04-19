import Link from "next/link";
import Avatar from "./Avatar";
import { profileDisplayName } from "@/lib/account/profile";
import type { FollowProfile } from "@/lib/account/follows";

export default function UserCard({ profile }: { profile: FollowProfile }) {
  const href = profile.username ? `/u/${profile.username}` : "#";

  return (
    <li className="border border-gray-100 rounded-lg p-4 flex items-center gap-4">
      <Link href={href} className="shrink-0">
        <Avatar profile={profile} size="md" />
      </Link>
      <div className="flex-1 min-w-0">
        <Link href={href} className="font-semibold text-dark hover:text-primary">
          {profileDisplayName(profile)}
        </Link>
        {profile.username && (
          <p className="text-xs text-gray">@{profile.username}</p>
        )}
        {profile.bio && (
          <p className="text-sm text-gray mt-1 line-clamp-2">{profile.bio}</p>
        )}
        {(profile.location || profile.goal_distance) && (
          <p className="text-xs text-gray mt-1">
            {profile.location}
            {profile.location && profile.goal_distance ? " · " : ""}
            {profile.goal_distance && `Goal: ${profile.goal_distance}`}
          </p>
        )}
      </div>
    </li>
  );
}
