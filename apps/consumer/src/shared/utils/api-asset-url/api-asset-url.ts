const ABSOLUTE_URL = /^[a-z][a-z\d+.-]*:/i

/**
 * Resolve assets próprios da API sem apontar para o domínio white-label.
 *
 * CONSTRAINT: `VITE_BASE_URL` é absoluto em produção, mas em dev local é o
 * caminho relativo do proxy do Vite (`/api`) — só ele evita os cookies
 * `sameSite: 'strict'` recusando a sessão. `new URL(path, base)` exige que
 * `base` seja absoluto e lança quando não é, então concatenar strings é o
 * único jeito que funciona com os dois formatos de base.
 */
export const resolveApiAssetUrl = (
  input?: string | null
): string | null => {
  const url = input?.trim()
  if (!url) return null
  if (ABSOLUTE_URL.test(url) || url.startsWith('//')) return url

  const configuredBase = (import.meta.env.VITE_BASE_URL as string | undefined)
    ?.trim()
  if (!configuredBase) return url

  const base = configuredBase.replace(/\/$/, '')
  const path = url.startsWith('/') ? url : `/${url}`
  return `${base}${path}`
}
