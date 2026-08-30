import { useMyOrders } from '@pages/Orders/hooks/useMyOrders/useMyOrders'

export const useOrdersFacade = () => {
  const orders = useMyOrders(true)

  return {
    orders: orders.data,
    isOrdersPending: orders.isPending,
  }
}
