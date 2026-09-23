import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { PromotionService } from '@shared/services/promotion/promotion.service'
import type { PromotionInput } from '@shared/types/marketing/promotion'

export const usePromotions = (unitId: string | null) => {
  const queryClient = useQueryClient()
  const query = useQuery({
    queryKey: queryKeys.promotions.list(unitId ?? ''),
    queryFn: () => PromotionService.list(unitId as string),
    enabled: !!unitId,
  })
  const save = useMutation({
    meta: {
      success: 'Promoção salva',
      errorTitle: 'A promoção não foi salva',
    },
    mutationFn: ({
      id,
      data,
    }: {
      id?: string
      data: PromotionInput
    }) =>
      id
        ? PromotionService.update(unitId as string, id, data)
        : PromotionService.create(unitId as string, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.promotions.list(unitId ?? ''),
      })
    },
  })

  return { query, save }
}
