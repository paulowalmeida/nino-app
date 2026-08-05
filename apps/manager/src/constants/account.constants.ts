export const ACCOUNT_PROVIDER_LABEL: Record<string, string> = {
  local: 'E-mail e senha',
  google: 'Google',
}

/** Nome, e-mail, telefone: os três campos da ficha, na mesma grade. */
export const ACCOUNT_GHOST_FIELDS = ['wide', 'regular', 'regular'] as const

/** Situação, assinada em, teste até, renova em, unidades: os cinco fatos. */
export const ACCOUNT_SUBSCRIPTION_GHOST_FACTS = [
  'first',
  'second',
  'third',
  'fourth',
  'fifth',
]
