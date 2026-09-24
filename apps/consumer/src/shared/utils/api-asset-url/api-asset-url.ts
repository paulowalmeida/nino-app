const ABSOLUTE_URL = /^[a-z][a-z\d+.-]*:/i

/** Resolve assets próprios da API sem apontar para o domínio white-label. */
export const resolveApiAssetUrl = (
  input?: string | null
): string | null => {
  const url = input?.trim()
  if (!url) return null
  if (ABSOLUTE_URL.test(url) || url.startsWith('//')) return url

  const configuredBase = (import.meta.env.VITE_BASE_URL as string | undefined)
    ?.trim()
  if (!configuredBase) return url

  try {
    return new URL(url, configuredBase.endsWith('/') ? configuredBase : `${configuredBase}/`).toString()
  } catch {
    return url
  }
}
