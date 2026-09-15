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
  const apiBaseUrl = import.meta.env.VITE_BASE_URL as string

  if (!apiBaseUrl) return null

  /* CONSTRAINT: o Google recusa `redirect_uri` relativo, e em
     desenvolvimento a base da API é o caminho do proxy do Vite (`/api`) —
     resolver contra a origem atual cobre os dois casos sem env extra.
     WORKAROUND: cada loja local é um subdomínio (`loja.localhost:3002`), mas
     o proxy do Vite escuta a mesma porta em qualquer host — por isso a base
     usada aqui descarta o subdomínio da página, senão o `redirect_uri`
     mudaria a cada loja e exigiria cadastro individual no Console. */
  const { protocol, port } = window.location
  const proxyOrigin = `${protocol}//localhost:${port}`
  const startUrl = new URL(
    `${apiBaseUrl}/consumer/auth/google/start`,
    proxyOrigin
  )
  startUrl.searchParams.set('returnUrl', returnUrl)

  return startUrl.toString()
}
