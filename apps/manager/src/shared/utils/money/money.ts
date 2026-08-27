const formatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

/*
 * `Intl.NumberFormat` não recusa entrada inválida: `format(undefined)` ou
 * `format(NaN)` devolvem "R$ NaN" em vez de lançar. Um campo que ainda não
 * chegou da API (skew de deploy, contrato mudou) vira literalmente "NaN" na
 * tela em vez de um erro que alguém notaria — pior tipo de bug, silencioso e
 * visível ao mesmo tempo. Mostrar "—" é honesto: não sabemos o valor, não
 * inventamos um.
 */
export const brl = (value: string | number | null | undefined): string => {
  const amount = typeof value === 'string' ? Number(value) : value
  return typeof amount === 'number' && Number.isFinite(amount)
    ? formatter.format(amount)
    : '—'
}
