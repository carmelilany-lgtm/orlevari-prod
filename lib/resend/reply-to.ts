import "server-only";

/** Extract bare address from "Name <email@domain.com>" or plain email. */
export function extractEmailAddress(value: string): string {
  const trimmed = value.trim();
  const angleMatch = trimmed.match(/<([^>]+)>/);
  if (angleMatch?.[1]) {
    return angleMatch[1].trim().toLowerCase();
  }
  return trimmed.toLowerCase();
}

/** Only set replyTo when non-empty and different from from (case-insensitive). */
export function shouldSetReplyTo(from: string, replyTo?: string | null): boolean {
  const reply = replyTo?.trim();
  if (!reply) {
    return false;
  }
  return extractEmailAddress(from) !== extractEmailAddress(reply);
}

/** Returns trimmed replyTo when it should be sent, otherwise undefined. */
export function resolveReplyTo(
  from: string,
  replyTo?: string | null,
): string | undefined {
  if (!shouldSetReplyTo(from, replyTo)) {
    return undefined;
  }
  return replyTo!.trim();
}
