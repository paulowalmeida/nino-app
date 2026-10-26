import type { ConsumerHistoryEntry } from './consumer-history-entry'

export type ConsumerHistoryPage = {
  data: ConsumerHistoryEntry[]
  pagination: {
    total: number
    page: number
    size: number
  }
}
