export function hasMeaningfulPhone(value: string): boolean {
  const normalized = value.trim().toLowerCase();
  const digits = value.replace(/\D/g, '');

  if (!digits) {
    return false;
  }

  if (normalized.includes('уточняется') || normalized.includes('placeholder') || normalized.includes('example')) {
    return false;
  }

  return !/^7?0{10}$/.test(digits) && digits.length >= 10;
}

export function hasMeaningfulEmail(value: string): boolean {
  const normalized = value.trim().toLowerCase();

  if (!normalized || normalized.includes('placeholder') || normalized.includes('example') || normalized.includes('уточняется')) {
    return false;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function hasMeaningfulHref(value?: string): boolean {
  if (!value) {
    return false;
  }

  const normalized = value.trim().toLowerCase();
  return Boolean(normalized) && !normalized.includes('placeholder') && !normalized.includes('example');
}