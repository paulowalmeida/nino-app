import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type {
  ConsumerNotification,
} from '@custom_types/notification/consumer-notification'
import {
  notificationService,
} from '@shared/services/notification/notification.service'

/** Cupom e avisos de conta do cliente logado — só existe com sessão. */
export const useConsumerNotifications = (enabled: boolean) => {
  const queryClient = useQueryClient()

  const query = useQuery<ConsumerNotification[]>({
    queryKey: queryKeys.myNotifications.all,
    queryFn: notificationService.listMine,
    enabled,
  })

  const markRead = useMutation({
    mutationFn: (id: string) => notificationService.markRead(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.myNotifications.all,
      })
    },
  })

  return { ...query, markRead: markRead.mutate }
}
