import type { PermissionDefinition } from '@shared/types/team/permission-definition.type'
import type { UnitPosition } from '@shared/types/team/unit-position.type'
import type { UnitPositionDraft } from '@shared/types/team/unit-position-draft.type'

export const unitIdMock = 'unit-1'
export const positionIdMock = 'position-1'

export const positionMock: UnitPosition = {
  id: positionIdMock,
  name: 'Caixa',
  level: 20,
  belowPositionId: null,
  permissions: ['cashbox.operate'],
  isDefault: false,
  isProtected: false,
  memberCount: 0,
}

export const positionDraftMock: UnitPositionDraft = {
  name: 'Caixa',
  belowPositionId: 'position-manager',
  permissions: ['cashbox.operate'],
}

export const permissionCatalogMock: PermissionDefinition[] = [
  {
    key: 'cashbox.operate',
    group: 'operation',
    label: 'Mexer no caixa',
    description: 'Abrir, movimentar e fechar o caixa.',
  },
]

export const removedMessageMock = { message: 'Deleted successfully' }
