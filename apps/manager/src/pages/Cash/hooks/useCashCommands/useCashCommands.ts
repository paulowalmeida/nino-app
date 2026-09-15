import { useMutation, useQueryClient } from '@tanstack/react-query'

import { toast } from '@nino/ds/components/Toast'
import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { CashService } from '@shared/services/cash/cash.service'
import type { CashMovementInput } from '@shared/types/cash/cash-movement-input'
import type { CashSession } from '@shared/types/cash/cash-session'
import type { CloseCashRequest } from '@shared/types/cash/close-cash'

export const useCashCommands = (
  unitId: string | null,
  sessionId: string | null
) => {
  const client = useQueryClient()

  const settle = (session: CashSession, message: string) => {
    client.setQueryData(queryKeys.cash.current(unitId as string), session)
    toast.success(message)
  }

  const openSession = useMutation({
    mutationFn: (openingFloat: number) =>
      CashService.openSession(unitId as string, { openingFloat }),
    onSuccess: (session) => settle(session, 'Caixa aberto'),
  })

  const addMovement = useMutation({
    mutationFn: (input: CashMovementInput) =>
      CashService.addMovement(unitId as string, sessionId as string, input),
    onSuccess: (session, input) =>
      settle(
        session,
        input.kind === 'WITHDRAWAL'
          ? 'Sangria registrada'
          : 'Suprimento registrado'
      ),
  })

  const closeSession = useMutation({
    mutationFn: (input: CloseCashRequest) =>
      CashService.closeSession(unitId as string, sessionId as string, input),
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: queryKeys.cash.all(unitId as string),
      })
      toast.success('Caixa fechado')
    },
  })

  return {
    submitOpen: openSession.mutate,
    submitMovement: addMovement.mutate,
    submitClose: closeSession.mutate,
    isOpening: openSession.isPending,
    isMoving: addMovement.isPending,
    isClosing: closeSession.isPending,
  }
}
