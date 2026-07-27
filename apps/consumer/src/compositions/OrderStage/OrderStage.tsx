import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

import { AnimatedNumber } from '@components/AnimatedNumber/AnimatedNumber'
import { OrderRail } from '@compositions/OrderRail/OrderRail'
import { useMinutesUntil } from '@hooks/useMinutesUntil'
import { clockLabel } from '@utils/clock'
import { STATUS_LABEL } from '@utils/order-flow'
import { etaLead, isTerminal, stageNote } from '@utils/order-journey'

import type { OrderStageProps } from './OrderStage.types'

import styles from './OrderStage.module.css'

/** Acima disso a contagem regressiva vira ansiedade: só o horário basta. */
const COUNTDOWN_CEILING = 90

export const OrderStage = ({ order, className, style }: OrderStageProps) => {
  const reduceMotion = useReducedMotion()
  const minutes = useMinutesUntil(order.estimatedDeliveryAt)
  const done = isTerminal(order.status)
  const cancelled = order.status === 'CANCELLED'

  const finishedAt = done ? order.timeline.at(-1)?.at : undefined

  const counting =
    !done && minutes !== null && minutes > 0 && minutes <= COUNTDOWN_CEILING
  const arriving = !done && minutes !== null && minutes <= 0

  return (
    <section
      className={[
        styles.stage,
        cancelled ? styles.stageCancelled : '',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
      aria-live="polite"
    >
      <p className={done ? styles.flagDone : styles.flag}>
        <span className={styles.flagDot} aria-hidden="true" />
        {done ? 'Pedido encerrado' : 'Acompanhando ao vivo'}
      </p>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={order.status}
          className={styles.copy}
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
          transition={{
            duration: reduceMotion ? 0 : 0.32,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <h2 className={styles.headline}>{STATUS_LABEL[order.status]}</h2>
          <p className={styles.note}>
            {stageNote(order.status, order.channel)}
          </p>
        </motion.div>
      </AnimatePresence>

      {counting && (
        <div className={styles.eta}>
          <p className={styles.etaLead}>{etaLead(order.channel)}</p>
          <p className={styles.etaValue}>
            <AnimatedNumber value={minutes} />
            <span className={styles.etaUnit}>min</span>
          </p>
          <p className={styles.etaClock}>
            por volta das {clockLabel(order.estimatedDeliveryAt as string)}
          </p>
        </div>
      )}

      {arriving && (
        <div className={styles.eta}>
          <p className={styles.etaLead}>{etaLead(order.channel)}</p>
          <p className={styles.etaSoon}>a qualquer momento</p>
        </div>
      )}

      {!done && !counting && !arriving && order.estimatedDeliveryAt && (
        <div className={styles.eta}>
          <p className={styles.etaLead}>{etaLead(order.channel)}</p>
          <p className={styles.etaSoon}>
            {clockLabel(order.estimatedDeliveryAt)}
          </p>
        </div>
      )}

      {done && !cancelled && finishedAt && (
        <div className={styles.eta}>
          <p className={styles.etaLead}>Concluído</p>
          <p className={styles.etaSoon}>às {clockLabel(finishedAt)}</p>
        </div>
      )}

      {!cancelled && <OrderRail order={order} />}
    </section>
  )
}
