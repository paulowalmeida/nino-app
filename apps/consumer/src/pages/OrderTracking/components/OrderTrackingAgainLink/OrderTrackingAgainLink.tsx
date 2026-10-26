import { Link } from 'react-router'

import type { OrderStatus } from '@custom_types/order/order-status'
import { riseDelay } from '@utils/rise-delay'

import styles from './OrderTrackingAgainLink.module.css'
import motion from '@styles/motion.module.css'

type OrderTrackingAgainLinkProps = {
  backHref: string
  status: OrderStatus
}

/* depois de um cancelamento a loja não empurra uma nova compra: o caminho de
   volta ao cardápio existe, mas em tom de saída, não de oferta */
export const OrderTrackingAgainLink = ({
  backHref,
  status,
}: OrderTrackingAgainLinkProps) => (
  <Link
    to={backHref}
    className={[
      motion.press,
      motion.riseIn,
      status === 'CANCELLED' ? styles.againQuiet : styles.again,
    ].join(' ')}
    style={riseDelay(420)}
  >
    {status === 'CANCELLED' ? 'Voltar ao cardápio' : 'Pedir de novo'}
  </Link>
)
