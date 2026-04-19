export function normalizePhone(value: string): string {
  const digits = value.replace(/\D/g, '');

  if (!digits) {
    return '';
  }

  if (digits.length === 11 && digits.startsWith('8')) {
    return `+7${digits.slice(1)}`;
  }

  if (digits.length === 10) {
    return `+7${digits}`;
  }

  if (digits.startsWith('7') && digits.length === 11) {
    return `+${digits}`;
  }

  if (value.trim().startsWith('+')) {
    return `+${digits}`;
  }

  return digits;
}

export function formatPhoneForDisplay(value: string): string {
  const normalized = normalizePhone(value).replace(/\D/g, '');

  if (normalized.length !== 11 || !normalized.startsWith('7')) {
    return value;
  }

  return `+7 (${normalized.slice(1, 4)}) ${normalized.slice(4, 7)}-${normalized.slice(7, 9)}-${normalized.slice(9, 11)}`;
}
