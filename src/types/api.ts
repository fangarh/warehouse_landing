export type ApiError = {
  status: number;
  message: string;
};

export type ApiRequestOptions = RequestInit & {
  body?: BodyInit | null | object;
};
