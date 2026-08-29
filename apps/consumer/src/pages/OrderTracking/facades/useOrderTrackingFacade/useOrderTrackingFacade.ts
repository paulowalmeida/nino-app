import { useParams, useSearchParams } from 'react-router'

import {
  useOrderTrackingStatus,
} from '@pages/order-tracking/hooks/useOrderTrackingStatus/useOrderTrackingStatus'
import { useScrollProgress } from '@hooks/useScrollProgress'
import { resolveBackHref } from '@utils/resolve-back-href'

export const useOrderTrackingFacade = () => {
  const { slug: pathSlug, orderId } = useParams()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? undefined
  const backHref = resolveBackHref(pathSlug)
  const progress = useScrollProgress(60)

  return {
    backHref,
    progress,
    ...useOrderTrackingStatus(orderId, token),
  }
}
