import type { Address } from '@custom_types/address/address'
import type { Customer } from '@custom_types/customer/customer'
import type { MyOrder } from '@custom_types/order/my-order'

const customer: Customer = {
  id: 'customer-1',
  name: 'Maria Silva',
  email: 'maria@example.com',
  phone: '11987654321',
  cpf: null,
  isActive: true,
  lastLoginAt: '2026-08-27T12:00:00.000Z',
  profileCompletedAt: '2025-01-10T12:00:00.000Z',
  createdAt: '2025-01-10T12:00:00.000Z',
  updatedAt: '2025-01-10T12:00:00.000Z',
}

const orders: MyOrder[] = [
  {
    id: 'order-1',
    orderNumber: 42,
    status: 'DELIVERED',
    channel: 'DELIVERY',
    totalAmount: '58.9',
    createdAt: '2026-08-20T18:30:00.000Z',
    estimatedDeliveryAt: null,
  },
]

const addresses: Address[] = [
  {
    id: 'address-1',
    street: 'Rua das Flores',
    number: '123',
    complement: null,
    neighborhood: 'Centro',
    city: 'São Paulo',
    state: 'SP',
    country: 'BR',
    zipCode: '01001000',
    isPrimary: true,
    createdAt: '2025-01-10T12:00:00.000Z',
    updatedAt: '2025-01-10T12:00:00.000Z',
  },
]

export const useAccountFacadeMock = {
  customer,
  tint: '#ff7a45',
  orders,
  addresses,
}
