import styles from './DisclosureTrigger.module.css'

type DisclosureTriggerProps = {
  children: string
}

/** O gatilho de todo campo opcional dobrado: um "+" quieto e o rótulo. */
export const DisclosureTrigger = ({ children }: DisclosureTriggerProps) => (
  <span className={styles.label}>
    <span className={styles.plus} aria-hidden="true">
      +
    </span>
    {children}
  </span>
)
