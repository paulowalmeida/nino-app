import bagIcon from '@assets/icons/bag.svg?raw'
import cardIcon from '@assets/icons/credit-card.svg?raw'
import fileIcon from '@assets/icons/file-text.svg?raw'
import messageIcon from '@assets/icons/message.svg?raw'
import pinIcon from '@assets/icons/map-pin.svg?raw'
import userIcon from '@assets/icons/user.svg?raw'
import type { AccountSection } from '@custom_types/account/account-section'

/**
 * As gavetas da conta, na ordem em que a pessoa procura: quem é, para onde
 * vai, o que já pediu — e depois o que ainda não existe.
 *
 * `soon` não é enfeite: a seção aparece no menu, abre, e diz o que falta. Um
 * item escondido faz a pessoa procurar; um item que abre e explica, não.
 */
export const ACCOUNT_SECTIONS: AccountSection[] = [
  { to: 'dados', label: 'Dados pessoais', icon: userIcon },
  { to: 'enderecos', label: 'Endereços', icon: pinIcon },
  { to: 'pedidos', label: 'Pedidos', icon: bagIcon },
  { to: 'pagamento', label: 'Pagamento', icon: cardIcon, soon: true },
  { to: 'conversas', label: 'Conversas', icon: messageIcon, soon: true },
  { to: 'notas', label: 'Notas fiscais', icon: fileIcon, soon: true },
]
