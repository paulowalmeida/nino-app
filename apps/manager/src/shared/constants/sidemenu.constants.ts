import type { SidemenuItem } from '@shared/types/ui/sidemenu-item.type'

export const SIDEMENU_GROUPS: SidemenuItem[] = [
  {
    items: [
      {
        section: 'visao-geral',
        label: 'Visão geral',
        icon: 'home',
        permission: 'reports.view',
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
        permission: 'catalog.manage',
      },
      {
        section: 'categorias-produtos',
        label: 'Categorias',
        icon: 'tag',
        permission: 'catalog.manage',
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
        permission: 'reports.view',
      },
      {
        section: 'clientes',
        label: 'Clientes',
        icon: 'users',
        permission: 'customers.view',
      },
      {
        section: 'colaboradores',
        label: 'Colaboradores',
        icon: 'badge',
        permission: 'team.view',
      },
      {
        section: 'cargos',
        label: 'Cargos',
        icon: 'shield',
        ownerOnly: true,
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
        permission: 'settings.manage',
      },
      {
        section: 'unidade/horarios',
        label: 'Horários',
        icon: 'clock',
        permission: 'settings.manage',
      },
      {
        section: 'promocoes',
        label: 'Promoções',
        icon: 'tag',
        permission: 'promotions.manage',
      },
      {
        section: 'unidade/atendimento',
        label: 'Atendimento',
        icon: 'headphones',
        permission: 'settings.manage',
      },
      {
        section: 'unidade/pagamento',
        label: 'Pagamento',
        icon: 'credit-card',
        permission: 'settings.manage',
      },
      {
        section: 'unidade/entrega',
        label: 'Entrega',
        icon: 'pin',
        permission: 'settings.manage',
      },
      {
        section: 'unidade/salao-comandas',
        label: 'Salão e comandas',
        icon: 'table',
        permission: 'settings.manage',
      },
      {
        section: 'unidade/contato',
        label: 'Contato',
        icon: 'phone',
        permission: 'settings.manage',
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
        ownerOnly: true,
      },
      {
        section: 'empresa/unidades',
        label: 'Unidades',
        icon: 'store',
        permission: 'settings.manage',
      },
      {
        section: 'empresa/personalizar',
        label: 'Personalizar',
        icon: 'sliders',
        ownerOnly: true,
      },
    ],
  },
]
