import type { IconName } from '@nino/ds/components/Icon'

/** Uma gaveta da conta. `soon` marca o que ainda não tem servidor por trás. */
export type AccountSection = {
  to: string
  label: string
  icon: IconName
  soon?: boolean
}
