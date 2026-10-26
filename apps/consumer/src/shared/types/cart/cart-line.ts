import type { CartItem } from './cart-item'

export type CartLine = {
  /**
   * WHY: identidade da linha, não do produto — o mesmo lanche com bacon e sem
   * bacon são duas linhas, e é por esta chave que a sacola soma e apaga.
   */
  id: string
  item: CartItem
  quantity: number
}
