import { useCallback, useEffect, useState } from 'react'

import type { GuestOrderReference } from '@shared/lib/last-order/last-order'
import {
  readGuestOrders,
  subscribeGuestOrders,
} from '@shared/lib/last-order/last-order'

export const useGuestOrders = (slug?: string): GuestOrderReference[] => {
  const read = useCallback(() => readGuestOrders(slug), [slug])
  const [orders, setOrders] = useState(read)

  useEffect(() => {
    setOrders(read())
    return subscribeGuestOrders(() => setOrders(read()))
  }, [read])

  return orders
}
