import type { UnitPosition } from '@shared/types/team/unit-position.type'

/** Cargos que quem tem `actorLevel` pode conceder: abaixo dele, nunca o do Dono. */
export const assignablePositions = (
  positions: UnitPosition[],
  actorLevel: number
): UnitPosition[] =>
  positions.filter(({ isProtected, level }) => !isProtected && level < actorLevel)

/** Cargo só sobe: entre os concedíveis, os acima do nível atual do membro. */
export const promotionTargets = (
  assignable: UnitPosition[],
  currentLevel: number
): UnitPosition[] => assignable.filter(({ level }) => level > currentLevel)
