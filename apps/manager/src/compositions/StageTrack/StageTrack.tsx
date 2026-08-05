import { Chip } from '@nino/ds/components/Chip'
import { CountUp } from '@nino/ds/components/CountUp'
import { Icon } from '@nino/ds/components/Icon'
import type { OrderStage } from '@custom_types/order/order-stage'
import type { StageOption } from '@custom_types/order/stage-option'
import { riseDelay } from '@utils/rise-delay'

import styles from './StageTrack.module.css'
import motion from '@styles/motion.module.css'

export type StageTrackProps = {
  stages: StageOption[]
  value: OrderStage
  onChange: (stage: OrderStage) => void
}

/**
 * The queue is a sequence — a pedido walks the track from left to right —
 * so the filter is drawn as the track itself, not as loose tabs.
 */
export const StageTrack = ({ stages, value, onChange }: StageTrackProps) => (
  <div className={styles.track} role="tablist" aria-label="Etapas da fila">
    {stages.map(({ id, label, count, icon }, index) => (
      <Chip
        key={id}
        variant="tab"
        selected={id === value}
        onClick={() => onChange(id)}
        style={riseDelay(index * 60 + 60)}
        className={`${motion.deal} ${styles.stage} ${
          id === value ? styles.current : ''
        }`}
      >
        <Icon name={icon} className={styles.icon} />
        <span className={styles.label}>{label}</span>
        <span className={styles.count}>
          <CountUp value={count} />
        </span>
      </Chip>
    ))}
  </div>
)
