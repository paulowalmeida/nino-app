import type { SectionLink } from '@compositions/SectionNav/SectionNav.types'

/**
 * Fonte única das seções de Configurações: o menu lateral usa como subitens
 * e a tela usa como trilho no celular.
 */
export const SETTINGS_SECTIONS: SectionLink[] = [
  { to: 'empresa', label: 'Empresa', hint: 'CNPJ, razão social e endereço' },
  { to: 'unidade', label: 'Unidades', hint: 'Esta loja e as outras da empresa' },
  {
    to: 'atendimento',
    label: 'Atendimento',
    hint: 'Canais, pagamento e pedido mínimo',
  },
  { to: 'horarios', label: 'Horários', hint: 'Quando a loja abre e fecha' },
  { to: 'entrega', label: 'Entrega', hint: 'Regiões atendidas e taxa' },
  { to: 'contato', label: 'Contato', hint: 'Telefones da loja' },
]
