import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { TenantDetail, UpdateTenantRequest } from '@custom_types/store'
import { getTenant, updateTenant } from '@services/store/store.service'

const detailKey = (tenantId: string) => [
  ...queryKeys.tenant.all(tenantId),
  'detail',
]

export const useTenantDetail = (tenantId: string | null) =>
  useQuery<TenantDetail>({
    queryKey: detailKey(tenantId ?? ''),
    queryFn: () => getTenant(tenantId as string),
    enabled: !!tenantId,
  })

export const useSaveTenant = (tenantId: string | null) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateTenantRequest) =>
      updateTenant(tenantId as string, data),
    onSuccess: (tenant) =>
      queryClient.setQueryData(detailKey(tenantId ?? ''), tenant),
  })
}
