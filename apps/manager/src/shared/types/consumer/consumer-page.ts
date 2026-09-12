import type { TenantConsumer } from './tenant-consumer'

export type ConsumerPage = {
  data: TenantConsumer[]
  pagination: {
    total: number
    page: number
    size: number
  }
}
