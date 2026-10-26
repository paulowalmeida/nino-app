import type { ConsumerAddress } from './consumer-address'
import type { ConsumerHistoryEntry } from './consumer-history-entry'
import type { UnitConsumer } from './unit-consumer'

export type ConsumerHistory = UnitConsumer & {
  cpf: string | null
  addresses: ConsumerAddress[]
  history: ConsumerHistoryEntry[]
}
