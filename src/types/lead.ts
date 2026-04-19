export type LeadFormPayload = {
  name: string;
  phone: string;
  comment: string;
  consent: boolean;
};

export type LeadFormErrors = Partial<Record<keyof LeadFormPayload, string>>;

export type LeadSubmitResult = {
  ok: boolean;
  message: string;
};
