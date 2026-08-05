import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { CourierPage } from '@custom_types/team/courier-page'
import { CourierService } from '@services/courier.service'

export const useCouriers = (tenantId: string | null) =>
  useQuery<CourierPage>({
    queryKey: [...queryKeys.team.all(tenantId ?? ''), 'couriers'],
    queryFn: () => CourierService.listCouriers(tenantId as string),
    enabled: !!tenantId,
  })
