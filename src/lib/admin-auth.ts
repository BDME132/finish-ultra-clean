import { createHmac } from "crypto";

export const COOKIE_NAME = "admin_session";
export const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours

export function generateSessionToken(): string {
  const timestamp = Date.now().toString();
  const secret = process.env.ADMIN_PASSWORD || "";
  const hmac = createHmac("sha256", secret);
  hmac.update(timestamp);
  return `${timestamp}.${hmac.digest("hex")}`;
}

export function verifySessionToken(token: string): boolean {
  if (!token) return false;

  const [timestamp, signature] = token.split(".");
  if (!timestamp || !signature) return false;

  // Check if token is expired (24 hours)
  const tokenTime = parseInt(timestamp, 10);
  if (isNaN(tokenTime) || Date.now() - tokenTime > COOKIE_MAX_AGE * 1000) {
    return false;
  }

  // Verify signature
  const secret = process.env.ADMIN_PASSWORD || "";
  const hmac = createHmac("sha256", secret);
  hmac.update(timestamp);
  const expectedSignature = hmac.digest("hex");

  return signature === expectedSignature;
}
