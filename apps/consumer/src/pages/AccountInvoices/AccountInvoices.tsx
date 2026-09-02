import { AccountSoon } from '@shared/components/ComingSoon/AccountSoon'

export const AccountInvoices = () => (
  <AccountSoon
    eyebrow="Notas fiscais"
    headline="A nota de cada pedido"
    note={
      'Baixar a nota fiscal dos seus pedidos ainda está em construção. '
      + 'Quando chegar, ela aparece aqui junto do pedido correspondente.'
    }
    icon="file-text"
  />
)
