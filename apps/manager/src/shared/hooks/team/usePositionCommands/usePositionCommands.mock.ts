import type { UnitPositionDraft } from '@shared/types/team/unit-position-draft.type'

export const positionCommandsUnitIdMock = 'unit-1'
export const positionCommandsPositionIdMock = 'position-1'

export const positionCommandsDraftMock: UnitPositionDraft = {
  name: 'Caixa',
  belowPositionId: 'position-manager',
  permissions: ['cashbox.operate'],
}
