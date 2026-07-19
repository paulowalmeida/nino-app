import type { Order } from './order'

export type OrderPage = {
  data: Order[]
  pagination: {
    total: number
    page: number
    size: number
  }
}
