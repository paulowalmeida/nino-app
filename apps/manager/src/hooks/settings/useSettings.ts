import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type {
  TenantSettings,
  UpdateTenantSettingsRequest,
} from '@custom_types/settings'
import { getSettings, saveSettings } from '@services/tenant/settings.service'

export const useSettings = (tenantId: string | null) =>
  useQuery<TenantSettings>({
    queryKey: queryKeys.tenant.settings(tenantId ?? ''),
    queryFn: () => getSettings(tenantId as string),
    enabled: !!tenantId,
  })

export const useSaveSettings = (tenantId: string | null) => {
  const queryClient = useQueryClient()

  return useMutation({
    meta: {
      success: 'Atendimento salvo',
      errorTitle: 'O atendimento não foi salvo',
    },
    mutationFn: (data: UpdateTenantSettingsRequest) =>
      saveSettings(tenantId as string, data),
    onSuccess: (settings) => {
      queryClient.setQueryData(
        queryKeys.tenant.settings(tenantId ?? ''),
        settings
      )
    },
  })
}
