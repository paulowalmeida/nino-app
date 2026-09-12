import type { ConsumerAddress } from './consumer-address'
import type { ConsumerHistoryEntry } from './consumer-history-entry'
import type { TenantConsumer } from './tenant-consumer'

export type ConsumerHistory = TenantConsumer & {
  cpf: string | null
  addresses: ConsumerAddress[]
  history: ConsumerHistoryEntry[]
}
