import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys'
import { TenantService } from '@shared/services/tenant/tenant.service'
import type { TenantPause } from '@shared/types/store/tenant-pause'

export const pauseKey = (tenantId: string) => [
  ...queryKeys.tenant.all(tenantId),
  'pause',
]

export const usePause = (tenantId: string | null) =>
  useQuery<TenantPause>({
    queryKey: pauseKey(tenantId ?? ''),
    queryFn: () => TenantService.getPause(tenantId as string),
    enabled: !!tenantId,
    refetchInterval: 60_000,
  })
