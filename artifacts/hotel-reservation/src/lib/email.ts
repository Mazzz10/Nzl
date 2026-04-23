export const GMAIL_SUFFIX = '@gmail.com';

export function normalizeGmailEmail(value: string) {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
        return GMAIL_SUFFIX;
    }

    const [usernameRaw] = trimmedValue.split('@');
    const username = usernameRaw.replace(/\s/g, '');

    return username ? `${username}${GMAIL_SUFFIX}` : GMAIL_SUFFIX;
}

export function getGmailUsername(value: string) {
    const normalized = normalizeGmailEmail(value);
    return normalized.slice(0, -GMAIL_SUFFIX.length);
}