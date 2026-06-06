import type { TrackingStepProps } from "./TrackingStep.types"
import styles from "./TrackingStep.module.css"

const nodeStyles = {
  done: styles.nodeDone,
  active: styles.nodeActive,
  pending: styles.nodePending,
}

const lineStyles = {
  done: styles.connectorDone,
  active: styles.connectorPending,
  pending: styles.connectorPending,
}

const labelStyles = {
  done: styles.stepLabelDone,
  active: styles.stepLabelActive,
  pending: styles.stepLabelPending,
}

const timeStyles = {
  done: styles.stepTimeDone,
  active: styles.stepTimeDone,
  pending: styles.stepTimePending,
}

export function TrackingStep({
  icon,
  label,
  time,
  status,
  isLast = false,
}: TrackingStepProps) {
  return (
    <div className={styles.step}>
      <div className={styles.stepIndicator}>
        <div className={nodeStyles[status]}>{icon}</div>
        {!isLast && <div className={lineStyles[status]} />}
      </div>

      <div className={styles.stepContent}>
        <div className={labelStyles[status]}>{label}</div>

        <div className={timeStyles[status]}>{time}</div>
      </div>
    </div>
  )
}
