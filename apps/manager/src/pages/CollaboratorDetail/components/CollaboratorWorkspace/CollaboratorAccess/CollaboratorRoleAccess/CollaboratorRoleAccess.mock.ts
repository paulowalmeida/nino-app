import type { StaffPosition } from '@shared/types/team/staff-position.type'
import type { UnitPosition } from '@shared/types/team/unit-position.type'

export const collaboratorRoleAccessMock = {
  current: { id: 'position-staff', name: 'Atendente', level: 10 } as StaffPosition,
  promotionOptions: [
    {
      id: 'position-cashier',
      name: 'Caixa',
      level: 30,
      permissions: ['cashbox.operate'],
      isDefault: false,
      isProtected: false,
      memberCount: 0,
    },
    {
      id: 'position-manager',
      name: 'Gerente',
      level: 50,
      permissions: ['catalog.manage'],
      isDefault: true,
      isProtected: false,
      memberCount: 1,
    },
  ] as UnitPosition[],
  hiddenRoleLabel: 'Dono',
}
