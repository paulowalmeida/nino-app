import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'
import { usePositionCommands } from '@shared/hooks/team/usePositionCommands/usePositionCommands'
import { usePositionPermissions } from '@shared/hooks/team/usePositionPermissions/usePositionPermissions'
import { useUnitPositions } from '@shared/hooks/team/useUnitPositions/useUnitPositions'

export const usePositionsFacade = () => {
  const unitId = useCurrentUnit()?.unitId ?? null
  const positionsQuery = useUnitPositions(unitId)
  const permissionsQuery = usePositionPermissions(unitId)
  const commands = usePositionCommands(unitId)

  return {
    positions: positionsQuery.data ?? [],
    permissionTotal: permissionsQuery.data?.length ?? 0,
    isPending: positionsQuery.isPending,
    isError: positionsQuery.isError,
    duplicatePosition: commands.duplicate.mutate,
    duplicatingId: commands.duplicate.isPending
      ? commands.duplicate.variables
      : undefined,
    movePosition: commands.update.mutate,
    removePosition: commands.remove.mutateAsync,
  }
}
