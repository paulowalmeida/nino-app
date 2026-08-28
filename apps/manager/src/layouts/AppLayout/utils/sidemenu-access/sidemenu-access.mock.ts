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
        roles: ['TENANT_OWNER'],
      },
    ],
  },
  {
    title: 'Configurações',
    items: [
      {
        section: 'configuracoes/entrega',
        label: 'Entrega',
        icon: 'pin',
        roles: ['TENANT_OWNER'],
      },
    ],
  },
]
