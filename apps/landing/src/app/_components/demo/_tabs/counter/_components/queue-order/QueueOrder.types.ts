export type QueueOrderProps = {
  code: string
  consumer: string
  items: string
  total: string
  status: string
  tone: "waiting" | "kitchen" | "pickup" | "delivery"
  trail: string
}
