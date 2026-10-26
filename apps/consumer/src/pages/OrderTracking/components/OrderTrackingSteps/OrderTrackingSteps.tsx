import { Text } from '@nino/ds/components/Text'
import type { GuestOrderStatus } from '@custom_types/order/guest-order-status'
import { riseDelay } from '@utils/rise-delay'

import { OrderJourney } from './OrderJourney/OrderJourney'
import styles from './OrderTrackingSteps.module.css'
import motion from '@styles/motion.module.css'

type OrderTrackingStepsProps = {
  order: GuestOrderStatus
}

export const OrderTrackingSteps = ({ order }: OrderTrackingStepsProps) => (
  <>
    <Text
      as="p"
      className={`${motion.riseIn} ${styles.eyebrow}`}
      style={riseDelay(160)}
    >
      Passo a passo
    </Text>

    <OrderJourney order={order} />
  </>
)
