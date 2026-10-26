import { baseOrderMock } from '@shared/utils/order-action-policy/order-action-policy.mock'

export const ordersHookPageMock = {
  data: [baseOrderMock],
  pagination: { page: 1, size: 40, total: 1 },
}
