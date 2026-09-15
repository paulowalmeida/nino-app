import { UNIT_MANAGER_ROLES } from '@shared/constants/roles.constants'
import type { SidemenuItem } from '@shared/types/ui/sidemenu-item.type'

export const SIDEMENU_GROUPS: SidemenuItem[] = [
  {
    items: [
      {
        section: 'visao-geral',
        label: 'Visão geral',
        icon: 'home',
        roles: UNIT_MANAGER_ROLES,
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
        section: 'produtos',
        label: 'Produtos',
        icon: 'book',
        roles: UNIT_MANAGER_ROLES,
      },
      {
        section: 'categorias-produtos',
        label: 'Categorias',
        icon: 'tag',
        roles: UNIT_MANAGER_ROLES,
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
        roles: UNIT_MANAGER_ROLES,
      },
      {
        section: 'clientes',
        label: 'Clientes',
        icon: 'users',
        roles: UNIT_MANAGER_ROLES,
      },
      {
        section: 'colaboradores',
        label: 'Colaboradores',
        icon: 'badge',
        roles: UNIT_MANAGER_ROLES,
      },
    ],
  },
  {
    title: 'Unidade',
    items: [
      {
        section: 'unidade/informacoes',
        label: 'Informações',
        icon: 'store',
        roles: UNIT_MANAGER_ROLES,
      },
      {
        section: 'unidade/horarios',
        label: 'Horários',
        icon: 'clock',
        roles: UNIT_MANAGER_ROLES,
      },
      {
        section: 'unidade/cashback',
        label: 'Cashback',
        icon: 'dollar-sign',
        roles: UNIT_MANAGER_ROLES,
      },
      {
        section: 'unidade/atendimento',
        label: 'Atendimento',
        icon: 'credit-card',
        roles: UNIT_MANAGER_ROLES,
      },
      {
        section: 'unidade/entrega',
        label: 'Entrega',
        icon: 'pin',
        roles: UNIT_MANAGER_ROLES,
      },
      {
        section: 'unidade/salao-comandas',
        label: 'Salão e comandas',
        icon: 'table',
        roles: UNIT_MANAGER_ROLES,
      },
      {
        section: 'unidade/contato',
        label: 'Contato',
        icon: 'phone',
        roles: UNIT_MANAGER_ROLES,
      },
    ],
  },
  {
    title: 'Empresa',
    items: [
      {
        section: 'empresa/informacoes',
        label: 'Informações',
        icon: 'building',
        roles: ['UNIT_OWNER'],
      },
      {
        section: 'empresa/unidades',
        label: 'Unidades',
        icon: 'store',
        roles: UNIT_MANAGER_ROLES,
      },
      {
        section: 'empresa/personalizar',
        label: 'Personalizar',
        icon: 'sliders',
        roles: ['UNIT_OWNER'],
      },
    ],
  },
]
