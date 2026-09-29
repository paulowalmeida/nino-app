export type ConsumerNotification = {
  id: string
  title: string
  body: string
  data: Record<string, unknown> | null
  readAt: string | null
  createdAt: string
  updatedAt: string
  type: {
    id: string
    name: string
    description: string | null
  }
}
