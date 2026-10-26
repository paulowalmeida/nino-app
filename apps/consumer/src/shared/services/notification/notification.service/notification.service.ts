import type { ConsumerNotification } from '@custom_types/notification/consumer-notification'
import { api } from '@shared/services/http/http.service'

/** O que a loja mandou ao cliente logado fora do rastreio ao vivo do pedido. */
export const notificationService = {
  listMine: (): Promise<ConsumerNotification[]> =>
    api.get<ConsumerNotification[]>('my/notifications'),
  markRead: (id: string): Promise<{ message: string }> =>
    api.patch<undefined, { message: string }>(
      `my/notifications/${id}/read`,
      undefined
    ),
}
