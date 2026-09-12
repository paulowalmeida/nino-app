import type { CounterSaleInput } from '@pages/Counter/types/CounterSaleInput.type'

export const counterSaleInputMock: CounterSaleInput = {
  lines: [{ productId: 'item-1', name: 'Café', unitPrice: '10', quantity: 2 }],
  channel: 'COUNTER',
  paymentMethod: 'CASH',
  consumerName: 'Ana',
  tableNumber: '4',
}
