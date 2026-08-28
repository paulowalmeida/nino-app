import { Box } from '@ds/components/Box/Box'
import { Chip } from '@nino/ds/components/Chip'
import { CountUp } from '@nino/ds/components/CountUp'
import { Icon } from '@nino/ds/components/Icon'
import type { StageOption } from '@pages/Orders/types/stage-option'
import type { OrderStage } from '@shared/types/order/order-stage'
import { riseDelay } from '@shared/utils/rise-delay/rise-delay'

import motion from '@styles/motion.module.css'
import styles from '@pages/Orders/components/StageTrack/StageTrack.module.css'

export type StageTrackProps = {
  stages: StageOption[]
  value: OrderStage
  onChange: (stage: OrderStage) => void
}

export const StageTrack = ({ stages, value, onChange }: StageTrackProps) => (
  <Box
    direction="row"
    className={styles.track}
    role="tablist"
    aria-label="Etapas da fila"
  >
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
  </Box>
)
