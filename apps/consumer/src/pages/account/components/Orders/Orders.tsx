import { Link, useParams } from 'react-router'

import { Badge } from '@nino/ds/components/Badge'
import { Box } from '@nino/ds/components/Box'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Eyebrow } from '@nino/ds/components/Eyebrow'
import { Heading } from '@nino/ds/components/Heading'
import { Icon } from '@nino/ds/components/Icon'
import { Text } from '@nino/ds/components/Text'
import {
  useAccountFacade,
} from '@pages/account/facades/useAccountFacade/useAccountFacade'
import { clockLabel } from '@utils/clock'
import { brl } from '@utils/money'
import { STATUS_LABEL } from '@constants/order.constants'
import { isTerminal, stageIcon } from '@utils/order-journey'
import { riseDelay } from '@utils/rise-delay'

import styles from './Orders.module.css'
import motion from '@styles/motion.module.css'

const day = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: '2-digit',
})

export const Orders = () => {
  const { slug } = useParams()
  const { orders, isOrdersPending } = useAccountFacade()

  const orderPath = (id: string) =>
    slug ? `/${slug}/pedido/${id}` : `/pedido/${id}`

  return (
    <Box>
      <Eyebrow>Pedidos</Eyebrow>
      <Heading level={2} size="lg" color="muted">
        Tudo que você já pediu aqui
      </Heading>
      <Text className={styles.note}>
        Toque em um pedido para ver a comanda, os valores e como foi o
        pagamento.
      </Text>

      {isOrdersPending && (
        <>
          <Box className={styles.skRow} />
          <Box className={styles.skRow} />
          <Box className={styles.skRow} />
        </>
      )}

      {!isOrdersPending && orders?.length === 0 && (
        <EmptyState size="md" className={styles.empty}>
          Seus pedidos aparecem aqui assim que você fizer o primeiro.
        </EmptyState>
      )}

      <Box as="ul" className={styles.list}>
        {orders?.map((order, index) => (
          <Box
            as="li"
            key={order.id}
            className={`${motion.deal} ${styles.item}`}
            style={riseDelay(index * 55)}
          >
            <Link to={orderPath(order.id)} className={styles.link}>
              <Text as="span" className={styles.stage} aria-hidden="true">
                {stageIcon(order.status)}
              </Text>

              <Text as="span" className={styles.body}>
                <Text as="span" className={styles.status}>
                  {STATUS_LABEL[order.status]}
                  {!isTerminal(order.status) && (
                    <Badge size="sm" className={styles.live}>
                      em andamento
                    </Badge>
                  )}
                </Text>
                <Text as="span" className={styles.when}>
                  {day.format(new Date(order.createdAt))} ·{' '}
                  {clockLabel(order.createdAt)}
                </Text>
              </Text>

              <Text as="span" className={styles.total}>
                {brl(Number(order.totalAmount))}
              </Text>

              <Icon name="chevron-right" className={styles.chevron} />
            </Link>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
