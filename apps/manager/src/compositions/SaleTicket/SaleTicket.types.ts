import type { CartLine } from '@custom_types/counter'
import type { OrderChannel, PaymentMethod } from '@custom_types/order'

export type SaleTicketProps = {
  lines: CartLine[]
  /** Quem vai buscar o pedido quando ficar pronto. */
  customerName: string
  tableNumber: string
  onCustomerName: (name: string) => void
  onTableNumber: (table: string) => void
  /** Formas que a unidade aceita, vindas das regras da loja. */
  methods: PaymentMethod[]
  channel: OrderChannel
  method: PaymentMethod
  isSending: boolean
  failed: boolean
  onStep: (productId: string, by: number) => void
  onChannel: (channel: OrderChannel) => void
  onMethod: (method: PaymentMethod) => void
  onClear: () => void
  onFinish: () => void
}
