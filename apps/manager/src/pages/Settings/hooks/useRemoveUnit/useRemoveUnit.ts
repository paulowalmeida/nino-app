import { useNavigate } from 'react-router'

import { useMutation } from '@tanstack/react-query'

import { UnitService } from '@shared/services/unit/unit.service'
import { useSessionStore } from '@shared/states/session/session.state'

/**
 * Removing a unit changes the session's store list, so the session is
 * cleared and the root route redirects to whichever unit remains.
 */
export const useRemoveUnit = () => {
  const navigate = useNavigate()

  return useMutation({
    meta: {
      success: 'Loja fechada',
      errorTitle: 'Não deu pra fechar a loja',
    },
    mutationFn: (unitId: string) => UnitService.removeUnit(unitId),
    onSuccess: () => {
      useSessionStore.getState().clear()
      void navigate('/')
    },
  })
}
