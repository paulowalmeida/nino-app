import type { PublicOpeningHours } from '@custom_types/opening-hours/public-opening-hours'
import type { Store } from '@custom_types/store/store'

export type StoreHeaderProps = {
  store: Store
  hours: PublicOpeningHours[]
}
