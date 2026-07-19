export type QueueOrderProps = {
  code: string
  customer: string
  items: string
  total: string
  status: string
  tone: "waiting" | "kitchen" | "pickup" | "delivery"
  trail: string
}
