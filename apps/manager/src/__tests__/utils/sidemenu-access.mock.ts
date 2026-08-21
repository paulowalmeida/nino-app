import type { SidemenuItem } from '@custom_types/sidemenu-item.type'
import { MANAGERS } from '@constants/roles'

export const menuGroups: SidemenuItem[] = [
  {
    title: 'Do dia',
    items: [{ section: 'pedidos', label: 'Pedidos', icon: 'bag' }],
  },
  {
    title: 'Da loja',
    items: [
      {
        section: 'relatorios',
        label: 'Relatórios',
        icon: 'bar-chart',
        roles: MANAGERS,
      },
      {
        section: 'configuracoes',
        label: 'Configurações',
        icon: 'settings',
        roles: MANAGERS,
        children: [
          {
            to: 'empresa',
            label: 'Empresa',
            icon: 'building',
          },
        ],
      },
    ],
  },
]
