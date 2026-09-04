export const counterReadbackLocalMock = {
  channel: 'COUNTER' as const,
  customerName: 'Ana',
  tableNumber: '12',
  addressLine: '',
  method: 'PIX' as const,
  changeAmount: 0,
}

export const counterReadbackCashMock = {
  channel: 'PICKUP' as const,
  customerName: '',
  tableNumber: '',
  addressLine: '',
  method: 'CASH' as const,
  changeAmount: 10,
}
