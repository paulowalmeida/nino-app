import messageIcon from '@assets/icons/message.svg?raw'

import { Soon } from './Soon'

export const Chats = () => (
  <Soon
    eyebrow="Conversas"
    headline="Falar com a loja"
    note="A conversa com a loja dentro do app ainda está em construção. Até lá, o contato do pedido chega pelo WhatsApp."
    icon={messageIcon}
  />
)
