import type { CustomerOrderRowModel } from '@pages/CustomerDetail/types/CustomerOrderRowModel.type'

export const customerOrderRowMock: CustomerOrderRowModel = {
  href: '../../pedidos/order-9f3a2b7c',
  number: '2B7C',
  statusLabel: 'entregue',
  statusVariant: 'success',
  createdAt: '2026-02-10T18:30:00.000Z',
  createdAtLabel: '10/02/2026 18:30',
  total: 'R$ 89,90',
}

export const customerBackLinkMock = {
  to: '/clientes/customer-1',
  label: 'Maria',
}
