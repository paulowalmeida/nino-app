import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys'
import { TenantService } from '@shared/services/tenant/tenant.service'
import type { TenantDetail } from '@shared/types/store/tenant-detail'

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
