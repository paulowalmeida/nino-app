import { useNavigate } from 'react-router'

import { useMutation } from '@tanstack/react-query'

import { TenantService } from '@services/tenant.service'
import { useSessionStore } from '@states/useSessionStore'

/**
 * Removing a tenant changes the session's store list, so the session is
 * cleared and the root route redirects to whichever tenant remains.
 */
export const useRemoveTenant = () => {
  const navigate = useNavigate()

  return useMutation({
    meta: {
      success: 'Loja fechada',
      errorTitle: 'Não deu pra fechar a loja',
    },
    mutationFn: (tenantId: string) => TenantService.removeTenant(tenantId),
    onSuccess: () => {
      useSessionStore.getState().clear()
      void navigate('/')
    },
  })
}
