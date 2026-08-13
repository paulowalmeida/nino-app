import { Icon } from '@ds/components/Icon/Icon'
import { Stamp } from '@ds/components/Stamp/Stamp'
import { mergeClasses } from '@ds/lib/mergeClasses/mergeClasses'

import styles from './DisclosureSeal.module.css'

type DisclosureSealProps = {
  className?: string
}

/**
 * The mark that says "this opens and closes": a chevron inside a `Stamp`
 * that spins and fills with brand ink once the panel is open.
 *
 * It reads the state of the trigger around it, so it has to sit inside an
 * element carrying the `group` class and the `data-state` Ark writes — which
 * is the case for `Accordion` and `Collapsible`.
 *
 * @param className - Additional CSS classes for the seal
 */
export function DisclosureSeal({ className }: DisclosureSealProps) {
  return (
    <Stamp className={mergeClasses(styles.seal, className)}>
      <Icon name="chevron-down" size="sm" className={styles.chevron} />
    </Stamp>
  )
}
