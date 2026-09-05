/**
 * O que o Google afirma sobre quem está entrando. `phone` é opcional porque o
 * escopo padrão não devolve telefone — a tela de confirmação trata a ausência
 * como o caso normal, não como erro.
 */
export type GoogleProfile = {
  providerCode: string
  email: string
  emailVerified: boolean
  name: string
  picture?: string
  phone?: string
}
