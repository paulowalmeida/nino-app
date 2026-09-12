import type { ConsumerOrderRowModel } from '@pages/ConsumerDetail/types/ConsumerOrderRowModel.type'

export const consumerOrderRowMock: ConsumerOrderRowModel = {
  href: '../../pedidos/order-9f3a2b7c',
  number: '2B7C',
  statusLabel: 'entregue',
  statusVariant: 'success',
  createdAt: '2026-02-10T18:30:00.000Z',
  createdAtLabel: '10/02/2026 18:30',
  total: 'R$ 89,90',
}

export const consumerBackLinkMock = {
  to: '/clientes/consumer-1',
  label: 'Maria',
}
