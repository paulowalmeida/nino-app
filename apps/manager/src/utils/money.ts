const formatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

/** Money arrives as a decimal string — parse only to display it. */
export const brl = (value: string | number): string =>
  formatter.format(typeof value === 'string' ? Number(value) : value)
