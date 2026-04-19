import type { LeadFormPayload, LeadSubmitResult } from '../types/lead';
import { normalizePhone } from '../utils/phone';

function delay(durationMs: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, durationMs);
  });
}

export async function submitLead(payload: LeadFormPayload): Promise<LeadSubmitResult> {
  const normalizedPayload = {
    ...payload,
    phone: normalizePhone(payload.phone),
    name: payload.name.trim(),
    comment: payload.comment.trim(),
  };

  await delay(900);

  // TODO: Replace mock submit with POST /api/leads.
  // Example:
  // return apiRequest<LeadSubmitResult>('/leads', {
  //   method: 'POST',
  //   body: normalizedPayload,
  // });
  void normalizedPayload;

  return {
    ok: true,
    message: 'Заявка принята. Мы свяжемся с вами, чтобы обсудить формат помещения и условия аренды.',
  };
}