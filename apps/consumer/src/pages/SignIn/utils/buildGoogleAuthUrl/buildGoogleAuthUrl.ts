const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth'

/**
 * Cada loja é um subdomínio, e o widget do Google (o que autentica dentro do
 * próprio navegador) só aceita origens cadastradas uma a uma — inviável para
 * lojas novas. O fluxo por redirect resolve isso: o navegador sai para o
 * Google e volta para uma única URL fixa da API, então nenhuma loja exige
 * cadastro manual no Console.
 *
 * Sem `VITE_GOOGLE_CLIENT_ID` devolve `null`, e quem chama simplesmente não
 * oferece o caminho do Google — o mesmo contrato de antes.
 */
export const buildGoogleAuthUrl = (returnUrl: string): string | null => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined
  const apiBaseUrl = import.meta.env.VITE_BASE_URL as string

  if (!clientId) return null

  const url = new URL(GOOGLE_AUTH_URL)
  url.searchParams.set('client_id', clientId)
  url.searchParams.set(
    'redirect_uri',
    `${apiBaseUrl}/customer/auth/google/callback`
  )
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('scope', 'openid email profile')
  url.searchParams.set('state', returnUrl)

  return url.toString()
}
