import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys'
import { SettingsService } from '@shared/services/settings/settings.service'
import type { UpdateTenantSettingsRequest } from '@shared/types/settings/update-tenant-settings-request'

/*
 * WHY: o cashback divide recurso com as outras configurações da unidade, então
 * a chamada leva o retrato inteiro — mandar só os campos do formulário apagaria
 * o que as outras telas gravaram.
 */
export const useSaveCashback = (tenantId: string | null) => {
  const queryClient = useQueryClient()

  return useMutation({
    meta: {
      success: 'Cashback salvo',
      errorTitle: 'O cashback não foi salvo',
    },
    mutationFn: (data: UpdateTenantSettingsRequest) =>
      SettingsService.saveSettings(tenantId as string, data),
    onSuccess: (settings) => {
      queryClient.setQueryData(
        queryKeys.tenant.settings(tenantId ?? ''),
        settings
      )
    },
  })
}
