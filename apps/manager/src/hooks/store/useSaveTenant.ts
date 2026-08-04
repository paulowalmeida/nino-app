import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { UpdateTenantRequest } from '@custom_types/store'
import { TenantService } from '@services/tenant.service'

import { detailKey } from './useTenantDetail'

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
