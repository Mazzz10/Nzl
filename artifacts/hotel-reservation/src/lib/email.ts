export const GMAIL_SUFFIX = '@gmail.com';

export function normalizeGmailEmail(value: string) {
    return value.trim().toLowerCase();
}

export function getGmailUsername(value: string) {
    const normalized = normalizeGmailEmail(value);
    const atIndex = normalized.indexOf('@');
    return atIndex === -1 ? normalized : normalized.slice(0, atIndex);
}