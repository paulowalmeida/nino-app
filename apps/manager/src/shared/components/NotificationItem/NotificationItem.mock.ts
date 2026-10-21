import type { ManagerNotification } from '@shared/types/notification/manager-notification.type'

export const unreadNotificationMock: ManagerNotification = {
  id: 'ntf-1',
  kind: 'order',
  title: 'Pedido #1042 chegou',
  description: 'Delivery · 3 itens · R$ 86,40',
  createdAt: '2026-10-21T14:00:00.000Z',
  readAt: null,
  path: 'pedidos',
}
