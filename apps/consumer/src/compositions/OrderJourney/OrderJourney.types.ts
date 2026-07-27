import type { CSSProperties } from 'react'

import type { GuestOrderStatus } from '@custom_types/order/guest-order-status'

export type OrderJourneyProps = {
  order: GuestOrderStatus
  className?: string
  style?: CSSProperties
}
