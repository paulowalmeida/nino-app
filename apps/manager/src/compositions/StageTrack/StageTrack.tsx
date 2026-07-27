import { CountUp } from '@components/CountUp'
import { NavIcon } from '@components/NavIcon'
import { riseDelay } from '@utils/rise-delay'

import type { StageTrackProps } from './StageTrack.types'

import styles from './StageTrack.module.css'
import motion from '@styles/motion.module.css'

/**
 * The queue is a sequence — a pedido walks the track from left to right —
 * so the filter is drawn as the track itself, not as loose tabs.
 */
export const StageTrack = ({ stages, value, onChange }: StageTrackProps) => (
  <div className={styles.track} role="tablist" aria-label="Etapas da fila">
    {stages.map(({ id, label, count }, index) => (
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
        <span className={styles.dot} />
        <span className={styles.label}>{label}</span>
        <span className={styles.count}>
          <CountUp value={count} />
        </span>
      </button>
    ))}
  </div>
)
