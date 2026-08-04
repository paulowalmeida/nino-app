import { SidemenuItem } from '@custom_types/sidemenu-item.type'
import { SettingsSection } from '@custom_types/ui/settings-section'
import { MANAGERS } from './roles'

const SETTINGS_SECTIONS: SettingsSection[] = [
  {
    to: 'empresa',
    label: 'Empresa',
    hint: 'CNPJ, razão social e endereço',
    icon: 'building',
  },
  {
    to: 'unidade',
    label: 'Unidades',
    hint: 'Esta loja e as outras da empresa',
    icon: 'store',
  },
  {
    to: 'atendimento',
    label: 'Atendimento',
    hint: 'Canais, pagamento e pedido mínimo',
    icon: 'credit-card',
  },
  {
    to: 'horarios',
    label: 'Horários',
    hint: 'Quando a loja abre e fecha',
    icon: 'clock',
  },
  {
    to: 'entrega',
    label: 'Entrega',
    hint: 'Regiões atendidas e taxa',
    icon: 'pin',
  },
  {
    to: 'contato',
    label: 'Contato',
    hint: 'Telefones da loja',
    icon: 'phone',
  },
]

export const SIDEMENU_GROUPS: SidemenuItem[] = [
  {
    title: 'Do dia',
    items: [
      {
        section: 'visao-geral',
        label: 'Visão geral',
        icon: 'home',
        roles: MANAGERS,
      },
      { section: 'balcao', label: 'Balcão', icon: 'cash-register' },
      { section: 'cozinha', label: 'Cozinha', icon: 'chef-hat' },
      { section: 'pedidos', label: 'Pedidos', icon: 'bag' },
      { section: 'catalogo', label: 'Cardápio', icon: 'book' },
    ],
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
        section: 'clientes',
        label: 'Clientes',
        icon: 'users',
        roles: MANAGERS,
      },
      {
        section: 'colaboradores',
        label: 'Equipe',
        icon: 'badge',
        roles: MANAGERS,
      },
      {
        section: 'configuracoes',
        label: 'Configurações',
        icon: 'settings',
        children: SETTINGS_SECTIONS,
        roles: MANAGERS,
      },
    ],
  },
]
