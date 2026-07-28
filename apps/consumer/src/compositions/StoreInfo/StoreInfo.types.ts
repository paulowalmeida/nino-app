import type { PublicOpeningHours } from '@custom_types/opening-hours/public-opening-hours'
import type { Store } from '@custom_types/store/store'

export type StoreInfoProps = {
  store: Store
  hours: PublicOpeningHours[]
  estimatedMinutes?: number
  open: boolean
  onOpenChange: (open: boolean) => void
}
