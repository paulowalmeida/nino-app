import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'

import type { OrderCreatedResponse } from '@custom_types/order/order-created-response'
import { readLastOrder } from '@utils/last-order'

type UseCheckoutResumeParams = {
  pathSlug: string | null
  storeSlug: string | undefined
  isStoreReady: boolean
  created: OrderCreatedResponse | undefined
  cartItemCount: number
}

export const useCheckoutResume = ({
  pathSlug,
  storeSlug,
  isStoreReady,
  created,
  cartItemCount,
}: UseCheckoutResumeParams) => {
  const navigate = useNavigate()
  const [storedOrder] = useState(readLastOrder)

  // Um pedido salvo pertence a uma loja específica. Nunca monte o id/token de
  // uma loja antiga na URL da loja que está aberta agora.
  const lastOrder = useMemo(
    () =>
      storeSlug && storedOrder?.slug === storeSlug ? storedOrder : null,
    [storeSlug, storedOrder]
  )

  useEffect(() => {
    // Enquanto a loja não resolveu, cartItemCount=0 significa "ainda não sei",
    // não "sacola vazia". Redirecionar nesse frame causava a corrida reportada.
    if (!isStoreReady || created || cartItemCount > 0 || !lastOrder) return

    void navigate(
      `${pathSlug ? `/${pathSlug}` : ''}/pedido/` +
        `${lastOrder.orderId}?token=${lastOrder.token}`,
      { replace: true }
    )
  }, [
    cartItemCount,
    created,
    isStoreReady,
    lastOrder,
    navigate,
    pathSlug,
  ])

  return lastOrder
}
