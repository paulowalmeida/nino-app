import { useNavigate } from 'react-router'

import { usePositionCommands } from '@shared/hooks/team/usePositionCommands/usePositionCommands'
import type { UnitPositionDraft } from '@shared/types/team/unit-position-draft.type'

export const usePositionDetailActions = (
  unitId: string | null,
  positionId: string | undefined
) => {
  const navigate = useNavigate()
  const commands = usePositionCommands(unitId)

  const backToList = () => navigate('..', { relative: 'path' })

  const save = async (draft: UnitPositionDraft) => {
    if (positionId) {
      await commands.update.mutateAsync({ positionId, draft })
    } else {
      await commands.create.mutateAsync(draft)
    }
    await backToList()
  }

  const rename = async (name: string) => {
    await commands.update.mutateAsync({
      positionId: positionId as string,
      draft: { name },
    })
  }

  const remove = async () => {
    await commands.remove.mutateAsync(positionId as string)
    await backToList()
  }

  return {
    save,
    rename,
    remove,
  }
}
