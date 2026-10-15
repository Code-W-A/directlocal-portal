/** Production never trusts the request Host or a leftover local development origin. */
export function contactOrigin(requestUrl: string, productionOrigin: string | undefined, env: Record<string, string | undefined>) {
  return env.NODE_ENV === 'production' ? productionOrigin : env.CONTACT_ORIGIN || new URL(requestUrl).origin;
}
