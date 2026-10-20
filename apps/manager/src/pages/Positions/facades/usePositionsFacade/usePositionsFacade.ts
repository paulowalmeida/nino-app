import { usePositionCommands } from '@pages/Positions/hooks/usePositionCommands/usePositionCommands'
import { usePositionPermissions } from '@pages/Positions/hooks/usePositionPermissions/usePositionPermissions'
import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'
import { useUnitPositions } from '@shared/hooks/team/useUnitPositions/useUnitPositions'

export const usePositionsFacade = () => {
  const unitId = useCurrentUnit()?.unitId ?? null
  const positionsQuery = useUnitPositions(unitId)
  const permissionsQuery = usePositionPermissions(unitId)
  const commands = usePositionCommands(unitId)

  return {
    positions: positionsQuery.data ?? [],
    permissionCatalog: permissionsQuery.data ?? [],
    isPending: positionsQuery.isPending,
    isError: positionsQuery.isError,
    createPosition: commands.create.mutateAsync,
    updatePosition: commands.update.mutateAsync,
    duplicatePosition: commands.duplicate.mutate,
    duplicatingId: commands.duplicate.isPending
      ? commands.duplicate.variables
      : undefined,
    removePosition: commands.remove.mutateAsync,
  }
}
