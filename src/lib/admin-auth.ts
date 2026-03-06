import { createHmac, timingSafeEqual } from "crypto";

export const COOKIE_NAME = "admin_session";
export const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours

export function generateSessionToken(): string {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) {
    throw new Error("ADMIN_PASSWORD environment variable not set");
  }

  const timestamp = Date.now().toString();
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
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) return false;

  const hmac = createHmac("sha256", secret);
  hmac.update(timestamp);
  const expectedSignature = hmac.digest("hex");

  const signatureBuf = Buffer.from(signature, "utf8");
  const expectedBuf = Buffer.from(expectedSignature, "utf8");
  if (signatureBuf.length !== expectedBuf.length) return false;

  return timingSafeEqual(signatureBuf, expectedBuf);
}
