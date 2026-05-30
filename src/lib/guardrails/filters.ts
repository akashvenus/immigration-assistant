const API_KEY_PATTERNS = [
  /sk-[a-zA-Z0-9]{20,}/g,
  /AIza[0-9A-Za-z_-]{35,}/g,
  /ghp_[a-zA-Z0-9]{36,}/g,
  /xox[bpras]-[a-zA-Z0-9]{10,}/g,
  /AKIA[0-9A-Z]{16}/g,
  /-----BEGIN (RSA |EC )?PRIVATE KEY-----/g,
]

const SIN_PATTERN = /\b\d{3}-\d{3}-\d{3}\b/g
const PASSPORT_PATTERN = /\b[A-Z]{2}\d{6,9}\b/g

export function sanitizeInput(text: string): string {
  let sanitized = text
  for (const pattern of API_KEY_PATTERNS) {
    sanitized = sanitized.replace(pattern, '[REDACTED API KEY]')
  }
  sanitized = sanitized.replace(SIN_PATTERN, '[REDACTED SIN]')
  sanitized = sanitized.replace(PASSPORT_PATTERN, '[REDACTED PASSPORT]')
  return sanitized
}

export function sanitizeOutput(text: string, validUrls: string[]): string {
  let sanitized = text

  sanitized = sanitized.replace(/I guarantee|100%|guaranteed success/i, 'I cannot guarantee')
  sanitized = sanitized.replace(/I am (a |an )?immigration lawyer/i, 'I am an AI immigration assistant')

  const urlRegex = /https?:\/\/[^\s\)\]]+/g
  const citedUrls = sanitized.match(urlRegex) || []
  for (const url of citedUrls) {
    const isValid = validUrls.some(v => url.startsWith(v))
    if (!isValid) {
      sanitized = sanitized.replace(url, '')
    }
  }

  return sanitized
}
