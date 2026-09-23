import { Link } from 'react-router'

import { Box } from '@ds/components/Box/Box'
import { Eyebrow } from '@ds/components/Eyebrow/Eyebrow'
import { ListRow } from '@ds/components/ListRow/ListRow'
import { Text } from '@ds/components/Text/Text'
import { STATUS_LABEL } from '@shared/constants/order.constants'
import { Order } from '@shared/types/order/order'
import { brl } from '@shared/utils/money/money'
import { ticketNumber } from '@shared/utils/order-ticket/order-ticket'
import { riseDelay } from '@shared/utils/rise-delay/rise-delay'

import motion from '@styles/motion.module.css'
import styles from './TallyHistory.module.css'

type TallyHistoy = {
  recent: Order[]
}

const clock = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
})

export const TallyHistory = ({ recent }: TallyHistoy) => {
  return (
    <Box
      as="section"
      id="ultimos-pedidos"
      aria-label="Últimos pedidos"
      className={styles.section}
    >
      <Eyebrow className="mb-3">Últimos pedidos</Eyebrow>

      <Box as="ul" direction="column">
        {recent.map((order, index) => (
          <ListRow
            key={order.id}
            padding={0}
            className={motion.deal}
            style={riseDelay(index * 50 + 120)}
          >
            <Link
              to={`../pedidos/${order.id}`}
              relative="path"
              className={`${motion.lift} ${styles.link}`}
            >
              <Text className={styles.number}>
                #{ticketNumber(order.orderNumber)}
              </Text>
              <Text className={styles.state}>{STATUS_LABEL[order.status]}</Text>
              <time className={styles.at} dateTime={order.createdAt}>
                {clock.format(new Date(order.createdAt))}
              </time>
              <Text className={styles.total}>{brl(order.totalAmount)}</Text>
            </Link>
          </ListRow>
        ))}
      </Box>
    </Box>
  )
}
