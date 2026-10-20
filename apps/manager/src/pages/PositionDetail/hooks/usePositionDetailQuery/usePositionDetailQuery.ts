import { useUnitPositions } from '@shared/hooks/team/useUnitPositions/useUnitPositions'
import type { UnitPosition } from '@shared/types/team/unit-position.type'

type PositionDetailQuery = {
  position: UnitPosition | undefined
  positions: UnitPosition[]
  isPending: boolean
  isError: boolean
}

export const usePositionDetailQuery = (
  unitId: string | null,
  positionId: string | undefined
): PositionDetailQuery => {
  const { data, isPending, isError } = useUnitPositions(unitId)

  return {
    position: data?.find(({ id }) => id === positionId),
    positions: data ?? [],
    isPending,
    isError,
  }
}
