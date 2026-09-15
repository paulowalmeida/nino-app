export type ConsumerUnit = {
  id: string
  loyaltyPoints: number
  createdAt: string
  updatedAt: string
  unit: {
    id: string
    slug: string
    customName: string | null
    logoUrl: string | null
  }
}
