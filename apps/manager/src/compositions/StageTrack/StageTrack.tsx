import { CountUp } from '@nino/ds/components/CountUp'
import { Icon, type IconName } from '@nino/ds/components/Icon'
import type { OrderStage } from '@custom_types/order'
import { riseDelay } from '@utils/rise-delay'

import styles from './StageTrack.module.css'
import motion from '@styles/motion.module.css'

export type StageOption = {
  id: OrderStage
  label: string
  count: number
  icon: IconName
}

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
      <button
        key={id}
        type="button"
        role="tab"
        aria-selected={id === value}
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
      </button>
    ))}
  </div>
)
