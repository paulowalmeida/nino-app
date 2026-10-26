export const counterReadbackLocalMock = {
  channel: 'COUNTER' as const,
  consumerName: 'Ana',
  addressLine: '',
  method: 'PIX' as const,
  changeAmount: 0,
}

export const counterReadbackCashMock = {
  channel: 'PICKUP' as const,
  consumerName: '',
  addressLine: '',
  method: 'CASH' as const,
  changeAmount: 10,
}
