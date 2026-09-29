import { useMyOrders } from '@shared/hooks/useMyOrders/useMyOrders'

export const useOrdersFacade = () => {
  const orders = useMyOrders(true)

  return {
    orders: orders.data,
    isOrdersPending: orders.isPending,
  }
}
