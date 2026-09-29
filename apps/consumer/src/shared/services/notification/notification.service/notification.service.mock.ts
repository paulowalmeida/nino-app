import type {
  ConsumerNotification,
} from '@custom_types/notification/consumer-notification'

export const notificationServiceMock: {
  notification: ConsumerNotification
} = {
  notification: {
    id: 'notification-1',
    title: 'Cupom novo na loja',
    body: '10% off no seu próximo pedido com VOLTA10',
    data: { promotionId: 'promotion-1' },
    readAt: null,
    createdAt: '2026-09-28T12:00:00.000Z',
    updatedAt: '2026-09-28T12:00:00.000Z',
    type: { id: 'type-1', name: 'PROMOTION', description: 'Promoção' },
  },
}
