import styles from './Spinner.module.css'

type SpinnerProps = {
  /** Renders nothing when false */
  visible: boolean
  /**
   * Side in pixels. Default: `16`, the size that sits inside a button without
   * changing its height
   */
  size?: number
  /** What a screen reader announces. Default: `Carregando` */
  label?: string
}

/**
 * Ring turning while something is under way.
 *
 * It announces itself as a live region, so a screen reader says the label
 * when it appears — which is why the label is product copy, in Portuguese.
 *
 * ```tsx
 * <Spinner visible={isPending} label="Salvando" />
 * ```
 */
export function Spinner({
  visible,
  size = 16,
  label = 'Carregando',
}: SpinnerProps) {
  if (!visible) return null

  return (
    <svg
      role="status"
      aria-label={label}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      className={styles.spinner}
    >
      <circle cx="12" cy="12" r="9" className={styles.ring} />
      <path d="M12 3a9 9 0 0 1 9 9" />
    </svg>
  )
}
