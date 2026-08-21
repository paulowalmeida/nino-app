import { Order } from '@custom_types/order/order'
import { Box } from '@ds/components/Box/Box'
import { ListRow } from '@ds/components/ListRow/ListRow'
import { Text } from '@ds/components/Text/Text'
import { Link } from 'react-router'

import motion from '@styles/motion.module.css'
import styles from './TallyHistory.module.css'

import { brl } from '@utils/money'
import { ticketNumber } from '@utils/order-flow'
import { riseDelay } from '@utils/rise-delay'
import { STATUS_LABEL } from '@constants/order.constants'

type TallyHistoy = {
  recent: Order[]
}

const clock = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
})

export const TallyHistory = ({ recent }: TallyHistoy) => {
  return (
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
            <Text className={styles.number}>#{ticketNumber(order.id)}</Text>
            <Text className={styles.state}>{STATUS_LABEL[order.status]}</Text>
            <time className={styles.at} dateTime={order.createdAt}>
              {clock.format(new Date(order.createdAt))}
            </time>
            <Text className={styles.total}>{brl(order.totalAmount)}</Text>
          </Link>
        </ListRow>
      ))}
    </Box>
  )
}
