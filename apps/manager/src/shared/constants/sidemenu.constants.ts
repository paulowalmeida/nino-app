import { MANAGERS } from '@shared/constants/roles.constants'
import type { SidemenuItem } from '@shared/types/ui/sidemenu-item.type'

export const SIDEMENU_GROUPS: SidemenuItem[] = [
  {
    items: [
      {
        section: 'visao-geral',
        label: 'Visão geral',
        icon: 'home',
        roles: MANAGERS,
      },
    ],
  },
  {
    title: 'Operação',
    items: [
      { section: 'balcao', label: 'Balcão', icon: 'cash-register' },
      { section: 'comandas', label: 'Comandas', icon: 'clipboard' },
      { section: 'cozinha', label: 'Cozinha', icon: 'chef-hat' },
      { section: 'pedidos', label: 'Pedidos', icon: 'bag' },
      { section: 'caixa', label: 'Caixa', icon: 'banknote' },
    ],
  },
  {
    title: 'Cardápio',
    items: [
      {
        section: 'catalogo',
        label: 'Produtos',
        icon: 'book',
        roles: MANAGERS,
      },
      {
        section: 'catalogo/categorias',
        label: 'Categorias',
        icon: 'tag',
        roles: MANAGERS,
      },
    ],
  },
  {
    title: 'Negócio',
    items: [
      {
        section: 'relatorios',
        label: 'Relatórios',
        icon: 'bar-chart',
        roles: MANAGERS,
      },
      {
        section: 'clientes',
        label: 'Clientes',
        icon: 'users',
        roles: MANAGERS,
      },
      {
        section: 'colaboradores',
        label: 'Colaboradores',
        icon: 'badge',
        roles: MANAGERS,
      },
    ],
  },
  {
    title: 'Unidade',
    items: [
      {
        section: 'unidade/detalhe',
        label: 'Esta unidade',
        icon: 'store',
        roles: MANAGERS,
      },
      {
        section: 'unidade/atendimento',
        label: 'Atendimento',
        icon: 'credit-card',
        roles: MANAGERS,
      },
      {
        section: 'unidade/entrega',
        label: 'Entrega',
        icon: 'pin',
        roles: MANAGERS,
      },
      {
        section: 'unidade/salao-comandas',
        label: 'Salão e comandas',
        icon: 'table',
        roles: MANAGERS,
      },
      {
        section: 'unidade/contato',
        label: 'Contato',
        icon: 'phone',
        roles: MANAGERS,
      },
      {
        section: 'unidade/personalizar',
        label: 'Personalizar',
        icon: 'sliders',
        roles: MANAGERS,
      },
      {
        section: 'unidade/unidades',
        label: 'Unidades',
        icon: 'building',
        roles: MANAGERS,
      },
    ],
  },
]
