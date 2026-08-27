import { useMutation, useQueryClient } from '@tanstack/react-query'

import { TenantService } from '@shared/services/tenant/tenant.service'
import type { UpdateTenantRequest } from '@shared/types/store/update-tenant-request'

import { detailKey } from '../useTenantDetail/useTenantDetail'

export const useSaveTenant = (tenantId: string | null) => {
  const queryClient = useQueryClient()

  return useMutation({
    meta: {
      success: 'Dados da unidade salvos',
      errorTitle: 'Os dados da unidade não foram salvos',
    },
    mutationFn: (data: UpdateTenantRequest) =>
      TenantService.updateTenant(tenantId as string, data),
    onSuccess: (tenant) =>
      queryClient.setQueryData(detailKey(tenantId ?? ''), tenant),
  })
}
