import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys'
import { CourierService } from '@shared/services/courier/courier.service'
import type { CourierPage } from '@shared/types/team/courier-page'

export const useCouriers = (tenantId: string | null) =>
  useQuery<CourierPage>({
    queryKey: [...queryKeys.team.all(tenantId ?? ''), 'couriers'],
    queryFn: () => CourierService.listCouriers(tenantId as string),
    enabled: !!tenantId,
  })
