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

/*
 * WHY: quem digita dinheiro no balcão digita da direita para a esquerda — "5",
 * "50", "500" é R$ 5,00. Formatar a cada tecla evita o erro clássico de trocar
 * a vírgula de casa e receber cem vezes o valor certo.
 */
export const maskMoney = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 9)
  if (!digits) return ''

  const padded = digits.padStart(3, '0')
  const whole = Number(padded.slice(0, -2))
  return `${whole.toLocaleString('pt-BR')},${padded.slice(-2)}`
}

/** Lê de volta o número que `maskMoney` escreveu. */
export const moneyValue = (masked: string): number =>
  Number(masked.replace(/\./g, '').replace(',', '.'))

/** Escreve um valor já conhecido no formato que o campo mascarado espera. */
export const maskMoneyAmount = (amount: number): string =>
  maskMoney(String(Math.round(amount * 100)))
