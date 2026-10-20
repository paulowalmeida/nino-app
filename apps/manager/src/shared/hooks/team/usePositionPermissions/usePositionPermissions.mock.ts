import type { PermissionDefinition } from '@shared/types/team/permission-definition.type'

export const positionPermissionsUnitIdMock = 'unit-1'

export const positionPermissionsCatalogMock: PermissionDefinition[] = [
  {
    key: 'cashbox.operate',
    group: 'operation',
    label: 'Mexer no caixa',
    description: 'Abrir, movimentar e fechar o caixa.',
  },
]
