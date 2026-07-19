import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { CourierPage } from '@custom_types/team'
import { listCouriers } from '@services/team/team.service'

export const useCouriers = (tenantId: string | null) =>
  useQuery<CourierPage>({
    queryKey: [...queryKeys.team.all(tenantId ?? ''), 'couriers'],
    queryFn: () => listCouriers(tenantId as string),
    enabled: !!tenantId,
  })
