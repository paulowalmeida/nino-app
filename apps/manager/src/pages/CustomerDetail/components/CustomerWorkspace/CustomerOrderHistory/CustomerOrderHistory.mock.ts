import type { CustomerOrderRowModel } from '@pages/CustomerDetail/types/CustomerOrderRowModel.type'

export const customerOrderRowsMock: CustomerOrderRowModel[] = [
  {
    href: '../../pedidos/order-9f3a2b7c',
    number: '2B7C',
    statusLabel: 'entregue',
    statusVariant: 'success',
    createdAt: '2026-02-10T18:30:00.000Z',
    createdAtLabel: '10/02/2026 18:30',
    total: 'R$ 89,90',
  },
  {
    href: '../../pedidos/order-1122cd34',
    number: 'CD34',
    statusLabel: 'cancelado',
    statusVariant: 'error',
    createdAt: '2026-01-02T10:05:00.000Z',
    createdAtLabel: '02/01/2026 10:05',
    total: 'R$ 42,00',
  },
]

export const customerOrderHistoryOwnerMock = {
  name: 'Maria Clara Souza',
  firstName: 'Maria',
}
