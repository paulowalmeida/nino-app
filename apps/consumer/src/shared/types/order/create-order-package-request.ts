import type { CreateOrderItemRequest } from './create-order-item-request'

export type CreateOrderPackageRequest = {
  promotionId: string
  groups: { groupId: string; items: CreateOrderItemRequest[] }[]
}
