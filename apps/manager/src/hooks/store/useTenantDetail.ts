import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { TenantDetail } from '@custom_types/store'
import { TenantService } from '@services/tenant.service'

export const detailKey = (tenantId: string) => [
  ...queryKeys.tenant.all(tenantId),
  'detail',
]

export const useTenantDetail = (tenantId: string | null) =>
  useQuery<TenantDetail>({
    queryKey: detailKey(tenantId ?? ''),
    queryFn: () => TenantService.getById(tenantId as string),
    enabled: !!tenantId,
  })
