import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys'
import { SettingsService } from '@shared/services/settings/settings.service'
import type { UpdateTenantSettingsRequest } from '@shared/types/settings/update-tenant-settings-request'

export const useSaveSettings = (tenantId: string | null) => {
  const queryClient = useQueryClient()

  return useMutation({
    meta: {
      success: 'Atendimento salvo',
      errorTitle: 'O atendimento não foi salvo',
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
