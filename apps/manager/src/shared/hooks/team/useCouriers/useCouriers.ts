import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { CourierService } from '@shared/services/courier/courier.service'
import type { CourierPage } from '@shared/types/team/courier-page'

export const useCouriers = (unitId: string | null) =>
  useQuery<CourierPage>({
    queryKey: [...queryKeys.team.all(unitId ?? ''), 'couriers'],
    queryFn: () => CourierService.listCouriers(unitId as string),
    enabled: !!unitId,
  })
