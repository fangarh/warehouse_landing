import { appConfig } from '../app/config';
import type { ApiError, ApiRequestOptions } from '../types/api';

function buildUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const base = appConfig.apiBaseUrl.replace(/\/$/, '');
  const normalizedPath = path.replace(/^\//, '');

  return `${base}/${normalizedPath}`;
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { body, headers, ...restOptions } = options;

  const response = await fetch(buildUrl(path), {
    ...restOptions,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: typeof body === 'object' && body !== null ? JSON.stringify(body) : body ?? null,
  });

  if (!response.ok) {
    const error: ApiError = {
      status: response.status,
      message: `API request failed with status ${response.status}.`,
    };

    throw error;
  }

  return (await response.json()) as T;
}
