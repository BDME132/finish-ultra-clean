import { createHmac, timingSafeEqual } from "crypto";

const TOKEN_MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;

function getSecret(): string {
  const s =
    process.env.NEWSLETTER_UNSUBSCRIBE_SECRET || process.env.ADMIN_PASSWORD;
  if (!s) {
    throw new Error(
      "NEWSLETTER_UNSUBSCRIBE_SECRET or ADMIN_PASSWORD must be set for unsubscribe tokens"
    );
  }
  return s;
}

export function signUnsubscribeToken(email: string): string {
  const normalized = email.trim().toLowerCase();
  const ts = Date.now().toString();
  const h = createHmac("sha256", getSecret());
  h.update(`${normalized}|${ts}`);
  const sig = h.digest("hex");
  const payload = `${normalized}|${ts}|${sig}`;
  return Buffer.from(payload, "utf8").toString("base64url");
}

export function verifyUnsubscribeToken(token: string): string | null {
  try {
    const raw = Buffer.from(token, "base64url").toString("utf8");
    const parts = raw.split("|");
    if (parts.length !== 3) return null;
    const [email, ts, sig] = parts;
    if (!email || !ts || !sig) return null;
    const t = parseInt(ts, 10);
    if (Number.isNaN(t) || Date.now() - t > TOKEN_MAX_AGE_MS) return null;

    const h = createHmac("sha256", getSecret());
    h.update(`${email}|${ts}`);
    const expected = h.digest("hex");
    const a = Buffer.from(sig, "utf8");
    const b = Buffer.from(expected, "utf8");
    if (a.length !== b.length) return null;
    if (!timingSafeEqual(a, b)) return null;
    return email;
  } catch {
    return null;
  }
}
