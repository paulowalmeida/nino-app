import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { UpdateTenantSettingsRequest } from '@custom_types/settings/update-tenant-settings-request'
import { SettingsService } from '@services/settings.service'

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
