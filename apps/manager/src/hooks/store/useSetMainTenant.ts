import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import { TenantService } from '@services/tenant.service'

export const useSetMainTenant = (tenantId: string | null) => {
  const queryClient = useQueryClient()

  return useMutation({
    meta: {
      success: 'Unidade definida como matriz',
      errorTitle: 'Não deu pra definir a matriz',
    },
    mutationFn: (id: string) => TenantService.setMainTenant(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.tenant.all(tenantId ?? ''),
      })
    },
  })
}
