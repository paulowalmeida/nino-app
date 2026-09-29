import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router'

import { useOrderTrackingStatus } from '@pages/order-tracking/hooks/useOrderTrackingStatus/useOrderTrackingStatus'
import { useScrollProgress } from '@hooks/useScrollProgress/useScrollProgress'
import { readGuestOrder, writeLastOrder } from '@utils/last-order'
import { resolveBackHref } from '@utils/resolve-back-href'
import { resolveSlug } from '@utils/resolve-slug'

export const useOrderTrackingFacade = () => {
  const { slug: pathSlug, orderId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const [routeToken] = useState(() => searchParams.get('token') ?? undefined)
  const token =
    routeToken ?? (orderId ? readGuestOrder(orderId)?.token : undefined)
  const backHref = resolveBackHref(pathSlug)
  const progress = useScrollProgress(60)

  useEffect(() => {
    if (!orderId || !routeToken || !searchParams.has('token')) return

    writeLastOrder({
      orderId,
      token: routeToken,
      slug: resolveSlug(pathSlug) ?? '',
    })
    const sanitized = new URLSearchParams(searchParams)
    sanitized.delete('token')
    setSearchParams(sanitized, { replace: true })
  }, [orderId, pathSlug, routeToken, searchParams, setSearchParams])

  return {
    backHref,
    progress,
    ...useOrderTrackingStatus(orderId, token),
  }
}
