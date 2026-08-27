import type { CustomerRowModel } from '@pages/Customers/types/CustomerRowModel.type'

export const customerRowsMock: CustomerRowModel[] = [
  {
    id: 'customer-1',
    name: 'Maria Clara Souza',
    phoneLabel: '(11) 98888-7777',
    spentLabel: 'R$ 890,50',
    ordersCount: '12',
    ordersLabel: ' pedidos',
    pointsLabel: '120',
    sinceLabel: '10 de mar. de 24',
  },
  {
    id: 'customer-2',
    name: 'João Pedro Lima',
    phoneLabel: '(11) 97777-6666',
    spentLabel: 'R$ 42,00',
    ordersCount: '1',
    ordersLabel: ' pedido',
    pointsLabel: '0',
    sinceLabel: '02 de nov. de 25',
  },
]
