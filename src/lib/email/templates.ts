import { SITE_URL } from "@/lib/schema";
import { signUnsubscribeToken } from "@/lib/unsubscribe-token";

const BRAND = "#2563eb";
const FROM = "FinishUltra <noreply@mail.finishultra.com>";

export { FROM };

export function unsubscribeUrlForEmail(email: string): string {
  try {
    const token = signUnsubscribeToken(email);
    return `${SITE_URL}/api/newsletter/unsubscribe?token=${encodeURIComponent(token)}`;
  } catch {
    return `${SITE_URL}/contact`;
  }
}

export function mailtoUnsubscribeUrl(email: string): string {
  const subject = encodeURIComponent("Unsubscribe from FinishUltra");
  const body = encodeURIComponent(
    `Please unsubscribe this address from the FinishUltra newsletter: ${email}`
  );
  return `mailto:finishultra@finishultra.com?subject=${subject}&body=${body}`;
}

export function listUnsubscribeHeaders(email: string): Record<string, string> {
  try {
    const token = signUnsubscribeToken(email);
    const url = `${SITE_URL}/api/newsletter/unsubscribe?token=${encodeURIComponent(token)}`;
    return {
      "List-Unsubscribe": `<${url}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    };
  } catch {
    return {};
  }
}

function emailFooterHtml(email: string): string {
  const web = unsubscribeUrlForEmail(email);
  return `
    <p style="margin-top:32px;padding-top:24px;border-top:1px solid #e5e7eb;font-size:12px;color:#6b7280;line-height:1.5;">
      You received this because you subscribed at <a href="${SITE_URL}" style="color:${BRAND};">FinishUltra</a>.<br/>
      <a href="${web}" style="color:${BRAND};">Unsubscribe</a> or reply to this email.
    </p>`;
}

function emailFooterText(email: string): string {
  const web = unsubscribeUrlForEmail(email);
  return `\n\n---\nFinishUltra · ${SITE_URL}\nUnsubscribe: ${web}`;
}

export function wrapEmailHtml(innerHtml: string, email: string): string {
  return `
    <div style="font-family:Segoe UI,system-ui,sans-serif;max-width:600px;margin:0 auto;color:#111827;">
      ${innerHtml}
      ${emailFooterHtml(email)}
    </div>`;
}

export function wrapEmailText(innerText: string, email: string): string {
  return `${innerText.trim()}${emailFooterText(email)}`;
}

export function welcomeEmailHtml(email: string): string {
  const inner = `
    <h1 style="color:${BRAND};font-size:24px;">Welcome to FinishUltra</h1>
    <p>Thanks for signing up — weekly ultra running tips are on the way.</p>
    <p><strong>What you&apos;ll get:</strong></p>
    <ul>
      <li>Training plan updates and tips</li>
      <li>Honest gear recommendations</li>
      <li>Race day strategies for beginners</li>
    </ul>
    <p>See you on the trails,<br/>The FinishUltra Team</p>`;
  return wrapEmailHtml(inner, email);
}

export function welcomeEmailText(email: string): string {
  const inner = `Welcome to FinishUltra

Thanks for signing up — weekly ultra running tips are on the way.

What you'll get:
- Training plan updates and tips
- Honest gear recommendations
- Race day strategies for beginners

See you on the trails,
The FinishUltra Team`;
  return wrapEmailText(inner, email);
}

export function appendNewsletterFooter(html: string, email: string): string {
  const trimmed = html.trim();
  if (/<\/body>/i.test(trimmed)) {
    return trimmed.replace(
      /<\/body>/i,
      `${emailFooterHtml(email)}</body>`
    );
  }
  return wrapEmailHtml(trimmed, email);
}

export function newsletterPlainTextFallback(html: string, email: string): string {
  const stripped = html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return wrapEmailText(stripped || "FinishUltra newsletter", email);
}
