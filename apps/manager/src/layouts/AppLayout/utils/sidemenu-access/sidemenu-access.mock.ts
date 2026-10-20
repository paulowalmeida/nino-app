import type { Membership } from '@shared/types/auth/membership'
import type { SidemenuItem } from '@shared/types/ui/sidemenu-item.type'

export const sidemenuAccessGroupsMock: SidemenuItem[] = [
  {
    title: 'Dia a dia',
    items: [
      { section: 'cozinha', label: 'Cozinha', icon: 'chef-hat' },
      {
        section: 'visao-geral',
        label: 'Visão geral',
        icon: 'home',
        permission: 'reports.view',
      },
    ],
  },
  {
    title: 'Configurações',
    items: [
      {
        section: 'empresa/informacoes',
        label: 'Informações',
        icon: 'building',
        ownerOnly: true,
      },
    ],
  },
]

export const sidemenuOwnerAccessMock: Pick<
  Membership,
  'role' | 'permissions'
> = { role: 'UNIT_OWNER', permissions: ['reports.view'] }

export const sidemenuReportsViewerAccessMock: Pick<
  Membership,
  'role' | 'permissions'
> = { role: 'STAFF', permissions: ['reports.view'] }

export const sidemenuCounterAccessMock: Pick<
  Membership,
  'role' | 'permissions'
> = { role: 'STAFF', permissions: ['orders.operate'] }
