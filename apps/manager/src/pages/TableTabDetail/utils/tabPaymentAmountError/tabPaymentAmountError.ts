export const tabPaymentAmountError = (
  amount: number,
  remainingAmount: number
): string | undefined => {
  if (!(amount > 0)) return 'Informe quanto será pago agora.'
  if (amount > remainingAmount) return 'Passa do que falta pagar.'
  return undefined
}
