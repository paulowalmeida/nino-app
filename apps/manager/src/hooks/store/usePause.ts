import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { TenantPause } from '@custom_types/store/tenant-pause'
import { TenantService } from '@services/tenant.service'

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
