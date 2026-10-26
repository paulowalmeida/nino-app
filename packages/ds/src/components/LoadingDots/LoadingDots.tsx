import styles from './LoadingDots.module.css'

type LoadingDotsProps = {
  /** Renders nothing when false */
  visible: boolean
  /** What a screen reader announces. Default: `Carregando` */
  label?: string
}

/**
 * Three dots rippling while something is under way.
 *
 * It announces itself as a live region, so a screen reader says the label
 * when the dots appear — which is why the label is product copy, in
 * Portuguese, and not a technical string.
 *
 * ```tsx
 * <LoadingDots visible={isPending} label="Buscando pedidos" />
 * ```
 */
export function LoadingDots({
  visible,
  label = 'Carregando',
}: LoadingDotsProps) {
  if (!visible) return null

  return (
    <span role="status" aria-label={label} className={styles.dotRow}>
      <span className={styles.dot} />
      <span className={styles.dot} />
      <span className={styles.dot} />
    </span>
  )
}
