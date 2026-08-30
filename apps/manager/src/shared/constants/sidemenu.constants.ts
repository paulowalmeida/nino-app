import { MANAGERS } from '@shared/constants/roles.constants'
import type { SidemenuItem } from '@shared/types/ui/sidemenu-item.type'

export const SIDEMENU_GROUPS: SidemenuItem[] = [
  {
    title: 'Dia a dia',
    items: [
      {
        section: 'visao-geral',
        label: 'Visão geral',
        icon: 'home',
        roles: MANAGERS,
      },
      { section: 'balcao', label: 'Balcão', icon: 'cash-register' },
      { section: 'comandas', label: 'Comandas', icon: 'clipboard' },
      { section: 'cozinha', label: 'Cozinha', icon: 'chef-hat' },
      { section: 'pedidos', label: 'Pedidos', icon: 'bag' },
      { section: 'catalogo', label: 'Cardápio', icon: 'book' },
    ],
  },
  {
    title: 'Gestão',
    items: [
      { section: 'caixa', label: 'Caixa', icon: 'banknote' },
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
    title: 'Configurações',
    items: [
      {
        section: 'configuracoes/unidade',
        label: 'Unidades',
        icon: 'store',
        roles: MANAGERS,
      },
      {
        section: 'configuracoes/atendimento',
        label: 'Atendimento',
        icon: 'credit-card',
        roles: MANAGERS,
      },
      {
        section: 'configuracoes/salao-comandas',
        label: 'Salão e comandas',
        icon: 'table',
        roles: MANAGERS,
      },
      {
        section: 'configuracoes/horarios',
        label: 'Horários',
        icon: 'clock',
        roles: MANAGERS,
      },
      {
        section: 'configuracoes/entrega',
        label: 'Entrega',
        icon: 'pin',
        roles: MANAGERS,
      },
      {
        section: 'configuracoes/contato',
        label: 'Contato',
        icon: 'phone',
        roles: MANAGERS,
      },
    ],
  },
]
