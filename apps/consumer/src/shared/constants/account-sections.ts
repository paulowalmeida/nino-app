import type { AccountSection } from '@custom_types/account/account-section'

/**
 * As gavetas da conta, na ordem em que a pessoa procura: quem é, para onde
 * vai, o que já pediu — e depois o acompanhamento do pedido atual.
 *
 * `soon` não é enfeite: a seção aparece no menu, abre, e diz o que falta. Um
 * O acompanhamento também funciona antes do login, usando o token do pedido.
 */
export const ACCOUNT_SECTIONS: AccountSection[] = [
  { to: 'dados', label: 'Dados pessoais', icon: 'user' },
  { to: 'enderecos', label: 'Endereços', icon: 'map-pin' },
  { to: 'pedidos', label: 'Pedidos', icon: 'bag' },
  { to: 'pagamento', label: 'Pagamento', icon: 'credit-card', soon: true },
  { to: 'conversas', label: 'Notificações', icon: 'bell' },
  { to: 'notas', label: 'Notas fiscais', icon: 'file-text', soon: true },
]
