import type { CartLine } from '@custom_types/counter'
import type { PaymentMethod } from '@custom_types/order'

export type SaleTicketProps = {
  lines: CartLine[]
  /** Quem vai buscar o pedido quando ficar pronto. */
  customerName: string
  tableNumber: string
  onCustomerName: (name: string) => void
  onTableNumber: (table: string) => void
  /** Formas que a unidade aceita, vindas das regras da loja. */
  methods: PaymentMethod[]
  method: PaymentMethod
  isSending: boolean
  error: string | null
  onStep: (productId: string, by: number) => void
  onMethod: (method: PaymentMethod) => void
  onClear: () => void
  onFinish: () => void
  /**
   * Dentro da folha do celular a moldura e o título são da própria folha —
   * repeti-los aqui viraria caixa dentro de caixa.
   */
  bare?: boolean
}
