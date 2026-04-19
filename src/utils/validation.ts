import type { LeadFormErrors, LeadFormPayload } from '../types/lead';

export function validateLeadForm(payload: LeadFormPayload): LeadFormErrors {
  const errors: LeadFormErrors = {};

  if (!payload.name.trim()) {
    errors.name = 'Укажите имя.';
  } else if (payload.name.trim().length < 2) {
    errors.name = 'Имя должно быть не короче 2 символов.';
  }

  const phoneDigits = payload.phone.replace(/\D/g, '');
  if (!phoneDigits) {
    errors.phone = 'Укажите телефон.';
  } else if (phoneDigits.length < 10) {
    errors.phone = 'Введите корректный телефон.';
  }

  if (!payload.consent) {
    errors.consent = 'Нужно согласие на обработку персональных данных.';
  }

  return errors;
}
