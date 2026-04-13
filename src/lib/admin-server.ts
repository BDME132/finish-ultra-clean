import { cookies } from "next/headers";
import { COOKIE_NAME, verifySessionToken } from "@/lib/admin-auth";

export async function hasAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return Boolean(token && verifySessionToken(token));
}
