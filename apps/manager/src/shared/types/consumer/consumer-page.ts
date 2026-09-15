import type { UnitConsumer } from './unit-consumer'

export type ConsumerPage = {
  data: UnitConsumer[]
  pagination: {
    total: number
    page: number
    size: number
  }
}
