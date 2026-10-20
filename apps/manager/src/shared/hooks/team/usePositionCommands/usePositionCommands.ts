import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { PositionsService } from '@shared/services/positions/positions.service/positions.service'
import type {
  UnitPositionDraft,
  UnitPositionPatch,
} from '@shared/types/team/unit-position-draft.type'

type UpdatePositionVariables = {
  positionId: string
  draft: UnitPositionPatch
}

export const usePositionCommands = (unitId: string | null) => {
  const queryClient = useQueryClient()
  const scope = unitId ?? ''

  const refreshPositions = () => {
    void queryClient.invalidateQueries({
      queryKey: queryKeys.positions.all(scope),
    })
    void queryClient.invalidateQueries({ queryKey: queryKeys.team.all(scope) })
  }

  const create = useMutation({
    meta: { success: 'Cargo criado', errorTitle: 'O cargo não foi criado' },
    mutationFn: (draft: UnitPositionDraft) =>
      PositionsService.create(unitId as string, draft),
    onSuccess: refreshPositions,
  })

  const update = useMutation({
    meta: {
      success: 'Cargo atualizado',
      errorTitle: 'O cargo não foi atualizado',
    },
    mutationFn: ({ positionId, draft }: UpdatePositionVariables) =>
      PositionsService.update(unitId as string, positionId, draft),
    onSuccess: refreshPositions,
  })

  const duplicate = useMutation({
    meta: {
      success: 'Cargo duplicado',
      errorTitle: 'O cargo não foi duplicado',
    },
    mutationFn: (positionId: string) =>
      PositionsService.duplicate(unitId as string, positionId),
    onSuccess: refreshPositions,
  })

  const remove = useMutation({
    meta: { success: 'Cargo removido', errorTitle: 'O cargo não foi removido' },
    mutationFn: (positionId: string) =>
      PositionsService.remove(unitId as string, positionId),
    onSuccess: refreshPositions,
  })

  return { create, update, duplicate, remove }
}
