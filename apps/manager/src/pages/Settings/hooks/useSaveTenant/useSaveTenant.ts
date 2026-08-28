import { useMutation, useQueryClient } from '@tanstack/react-query'

import { TenantService } from '@shared/services/tenant/tenant.service'
import type { UnitDraft } from '@shared/types/store/unit-draft'

import { detailKey } from '../useTenantDetail/useTenantDetail'

export const useSaveTenant = (tenantId: string | null) => {
  const queryClient = useQueryClient()

  return useMutation({
    meta: {
      success: 'Dados da unidade salvos',
      errorTitle: 'Os dados da unidade não foram salvos',
    },
    mutationFn: (data: UnitDraft) =>
      TenantService.saveTenant(tenantId as string, data),
    onSuccess: (tenant) =>
      queryClient.setQueryData(detailKey(tenantId ?? ''), tenant),
  })
}
