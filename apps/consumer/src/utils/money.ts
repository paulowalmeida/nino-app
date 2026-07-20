const formatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

/** Valor chega como string decimal (Prisma) — só formatar para exibir. */
export const brl = (value: string | number): string =>
  formatter.format(typeof value === 'string' ? Number(value) : value)
