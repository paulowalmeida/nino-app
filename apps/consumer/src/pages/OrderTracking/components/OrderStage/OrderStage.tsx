import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

import { Box } from '@nino/ds/components/Box'
import { Heading } from '@nino/ds/components/Heading'
import { Text } from '@nino/ds/components/Text'
import { AnimatedNumber } from '@shared/components/AnimatedNumber/AnimatedNumber'
import { OrderRail } from '@shared/components/OrderRail/OrderRail'
import { useMinutesUntil } from '@hooks/useMinutesUntil/useMinutesUntil'
import { clockLabel } from '@utils/clock'
import { EXPO_OUT_EASE } from '@constants/motion.constants'
import { useStoreTracking } from '@hooks/useStoreTracking/useStoreTracking'
import { etaLead, isTerminal, stageNote } from '@utils/order-journey'
import type { GuestOrderStatus } from '@custom_types/order/guest-order-status'
import { riseDelay } from '@utils/rise-delay'

import styles from './OrderStage.module.css'
import motionStyles from '@styles/motion.module.css'

type OrderStageProps = {
  order: GuestOrderStatus
}

/** Acima disso a contagem regressiva vira ansiedade: só o horário basta. */
const COUNTDOWN_CEILING = 90

export const OrderStage = ({ order }: OrderStageProps) => {
  const { stageLabel } = useStoreTracking()
  const reduceMotion = useReducedMotion()
  const minutes = useMinutesUntil(order.estimatedDeliveryAt)
  const isDone = isTerminal(order.status)
  const isCancelled = order.status === 'CANCELLED'

  const finishedAt = isDone ? order.timeline.at(-1)?.at : undefined

  const isCounting =
    !isDone && minutes !== null && minutes > 0 && minutes <= COUNTDOWN_CEILING
  const isArriving = !isDone && minutes !== null && minutes <= 0

  return (
    <Box
      as="section"
      className={[
        motionStyles.riseIn,
        styles.stage,
        isCancelled ? styles.stageCancelled : '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={riseDelay(60)}
      aria-live="polite"
    >
      <Text as="p" className={isDone ? styles.flagDone : styles.flag}>
        <Text as="span" className={styles.flagDot} aria-hidden="true" />
        {isDone ? 'Pedido encerrado' : 'Acompanhando ao vivo'}
      </Text>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={order.status}
          className={styles.copy}
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
          transition={{
            duration: reduceMotion ? 0 : 0.32,
            ease: EXPO_OUT_EASE,
          }}
        >
          <Heading level={2} className={styles.headline}>
            {stageLabel(order.status)}
          </Heading>
          <Text as="p" className={styles.orderStageNote}>
            {stageNote(order, order.status)}
          </Text>
        </motion.div>
      </AnimatePresence>

      {isCounting && (
        <Box className={styles.eta}>
          <Text as="p" className={styles.etaLead}>
            {etaLead(order)}
          </Text>
          <Text as="p" className={styles.etaValue}>
            <AnimatedNumber value={minutes} />
            <Text as="span" className={styles.etaUnit}>
              min
            </Text>
          </Text>
          <Text as="p" className={styles.etaClock}>
            por volta das {clockLabel(order.estimatedDeliveryAt as string)}
          </Text>
        </Box>
      )}

      {isArriving && (
        <Box className={styles.eta}>
          <Text as="p" className={styles.etaLead}>
            {etaLead(order)}
          </Text>
          <Text as="p" className={styles.etaSoon}>
            a qualquer momento
          </Text>
        </Box>
      )}

      {!isDone && !isCounting && !isArriving && order.estimatedDeliveryAt && (
        <Box className={styles.eta}>
          <Text as="p" className={styles.etaLead}>
            {etaLead(order)}
          </Text>
          <Text as="p" className={styles.etaSoon}>
            {clockLabel(order.estimatedDeliveryAt)}
          </Text>
        </Box>
      )}

      {isDone && !isCancelled && finishedAt && (
        <Box className={styles.eta}>
          <Text as="p" className={styles.etaLead}>
            Concluído
          </Text>
          <Text as="p" className={styles.etaSoon}>
            às {clockLabel(finishedAt)}
          </Text>
        </Box>
      )}

      {!isCancelled && <OrderRail order={order} />}
    </Box>
  )
}
