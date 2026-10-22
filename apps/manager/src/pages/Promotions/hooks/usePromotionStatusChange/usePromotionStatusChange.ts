import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { PromotionService } from '@shared/services/promotion/promotion.service/promotion.service'

export const usePromotionStatusChange = (unitId: string | null) => {
  const queryClient = useQueryClient()
  const onSuccess = () =>
    queryClient.invalidateQueries({
      queryKey: queryKeys.promotions.list(unitId ?? ''),
    })

  const pause = useMutation({
    meta: {
      success: 'Campanha pausada',
      errorTitle: 'A campanha não foi pausada',
    },
    mutationFn: (promotionId: string) =>
      PromotionService.pause(unitId as string, promotionId),
    onSuccess,
  })
  const resume = useMutation({
    meta: {
      success: 'Campanha retomada',
      errorTitle: 'A campanha não foi retomada',
    },
    mutationFn: (promotionId: string) =>
      PromotionService.resume(unitId as string, promotionId),
    onSuccess,
  })
  const end = useMutation({
    meta: {
      success: 'Campanha finalizada',
      errorTitle: 'A campanha não foi finalizada',
    },
    mutationFn: (promotionId: string) =>
      PromotionService.end(unitId as string, promotionId),
    onSuccess,
  })

  const changingId =
    [pause, resume].find((mutation) => mutation.isPending)?.variables ?? null

  return {
    pause: pause.mutate,
    resume: resume.mutate,
    end: end.mutate,
    isEnding: end.isPending,
    changingId,
  }
}
