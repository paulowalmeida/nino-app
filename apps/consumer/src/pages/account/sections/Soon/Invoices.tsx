import fileIcon from '@assets/icons/file-text.svg?raw'

import { Soon } from './Soon'

export const Invoices = () => (
  <Soon
    eyebrow="Notas fiscais"
    headline="A nota de cada pedido"
    note="Baixar a nota fiscal dos seus pedidos ainda está em construção. Quando chegar, ela aparece aqui junto do pedido correspondente."
    icon={fileIcon}
  />
)
