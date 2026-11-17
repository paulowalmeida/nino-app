import type { ConsumerNotification } from '@custom_types/notification/consumer-notification'

export const storeNotificationCardMock: {
  unread: ConsumerNotification
  read: ConsumerNotification
} = {
  unread: {
    id: 'notification-1',
    title: 'Cupom novo na loja',
    body: '10% off no seu próximo pedido com VOLTA10',
    data: { promotionId: 'promotion-1' },
    readAt: null,
    createdAt: '2026-09-28T12:00:00.000Z',
    updatedAt: '2026-09-28T12:00:00.000Z',
    type: { id: 'type-1', name: 'PROMOTION', description: 'Promoção' },
  },
  read: {
    id: 'notification-2',
    title: 'Endereço adicionado',
    body: 'Av. Paulista, 1000 foi salvo na sua conta.',
    data: { addressId: 'address-1' },
    readAt: '2026-09-28T12:05:00.000Z',
    createdAt: '2026-09-28T12:00:00.000Z',
    updatedAt: '2026-09-28T12:05:00.000Z',
    type: { id: 'type-2', name: 'USER', description: 'Usuário' },
  },
}
