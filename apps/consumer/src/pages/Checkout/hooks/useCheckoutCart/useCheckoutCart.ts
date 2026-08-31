import { useCartSummary } from '@hooks/useCartSummary/useCartSummary'

export const useCheckoutCart = (storeId: string | undefined) => {
  const cart = useCartSummary()
  const cartLines = cart.tenantId === storeId ? cart.cartLines : []

  return { ...cart, cartLines }
}
