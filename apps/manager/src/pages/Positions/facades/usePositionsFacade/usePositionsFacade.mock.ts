import type { PermissionDefinition } from '@shared/types/team/permission-definition.type'
import type { UnitPosition } from '@shared/types/team/unit-position.type'

export const positionsFacadeUnitMock = { unitId: 'unit-1' }

export const positionsFacadePositionsMock: UnitPosition[] = [
  {
    id: 'position-staff',
    name: 'Atendente',
    level: 10,
    belowPositionId: null,
    permissions: ['orders.operate'],
    isDefault: true,
    isProtected: false,
    memberCount: 2,
  },
]

export const positionsFacadeCatalogMock: PermissionDefinition[] = [
  {
    key: 'orders.operate',
    group: 'operation',
    label: 'Operar pedidos',
    description: 'Ver a fila e mudar status.',
  },
]
