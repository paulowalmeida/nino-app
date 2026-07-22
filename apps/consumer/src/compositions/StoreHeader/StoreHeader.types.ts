import type { WeekdaySchedule } from '@nino/lib'

import type { Store } from '@custom_types/store/store'

export type StoreHeaderProps = {
  store: Store
  hours: WeekdaySchedule[]
}
