import type { SidemenuItem } from '@shared/types/ui/sidemenu-item.type'

export const sidebarNavigationMock = {
  groups: [] as SidemenuItem[],
  tenantId: null,
  isCollapsed: false,
  waiting: 0,
}

export const settingsGroupMock: SidemenuItem[] = [
  {
    title: 'Configurações',
    items: [
      {
        section: 'configuracoes/empresa',
        label: 'Empresa',
        icon: 'building',
      },
      {
        section: 'configuracoes/entrega',
        label: 'Entrega',
        icon: 'pin',
      },
    ],
  },
]
