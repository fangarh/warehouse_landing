import { siteContent } from '../data/siteContent';
import type { SiteContent } from '../types/content';

export async function getSiteContent(): Promise<SiteContent> {
  // TODO: Replace local fallback with GET /api/content when ASP.NET Core backend is ready.
  return Promise.resolve(siteContent);
}
