import type { Order } from '@custom_types/order'
import type { OrderItem } from '@custom_types/order/order-item'
import type { OrderStatusEntry } from '@custom_types/order/order-status-entry'
import type { OrderStatusKey } from '@custom_types/order/order-status-key'

/**
 * Pedido de mentira para as telas de verdade. O onboarding mostra os próprios
 * componentes do painel — ficha, comanda, linha do tempo —, então precisa de um
 * pedido plausível para alimentá-los: X-Salada e refrigerante, o combo que
 * qualquer lanchonete reconhece. Valores em string porque é assim que a API
 * entrega (Decimal do Prisma).
 */
const AT = '2026-08-02T20:12:00.000Z'

const item = (
  id: string,
  name: string,
  quantity: number,
  unitPrice: string
): OrderItem => ({
  id: `demo-item-${id}`,
  productId: `demo-product-${id}`,
  quantity,
  unitPrice,
  product: { id: `demo-product-${id}`, name },
})

export const demoOrder = (
  status: OrderStatusKey,
  elapsedMinutes = 0
): Order => ({
  id: 'demo-1042',
  tenantId: 'demo-tenant',
  customerId: null,
  status,
  channel: 'DELIVERY',
  courierId: null,
  tableNumber: null,
  notes: 'Sem cebola',
  subtotal: '49.80',
  deliveryFee: '7.00',
  totalAmount: '56.80',
  deliveryZoneName: 'Centro',
  paymentMethod: 'PIX_ONLINE',
  paymentStatus: 'PAID',
  changeFor: null,
  cancelReason: null,
  cancelledBy: null,
  guestName: 'Marina Duarte',
  guestPhone: '11988887777',
  guestStreet: 'Rua das Flores',
  guestNumber: '128',
  guestComplement: null,
  guestNeighborhood: 'Centro',
  guestCity: 'Belém',
  guestState: 'PA',
  guestZipCode: '66010000',
  acceptedAt: null,
  deliveredAt: null,
  cancelledAt: null,
  createdAt: new Date(Date.now() - elapsedMinutes * 60_000).toISOString(),
  items: [
    item('a', 'X-Salada', 2, '19.90'),
    item('b', 'Guaraná lata', 1, '10.00'),
  ],
  statusHistory: [],
})

/** A trilha da tela de detalhe: chave de status crua e quem mexeu. */
export const demoTimeline = (): OrderStatusEntry[] =>
  (['PENDING', 'PREPARING', 'OUT_FOR_DELIVERY'] as OrderStatusKey[]).map(
    (status, index) => ({
      id: `demo-entry-${index}`,
      status,
      changedByRealm: index === 0 ? 'GUEST' : 'OPERATIONAL',
      changedById: null,
      createdAt: new Date(Date.parse(AT) + index * 6 * 60_000).toISOString(),
    })
  )
