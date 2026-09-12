export type ConsumerTenant = {
  id: string
  loyaltyPoints: number
  createdAt: string
  updatedAt: string
  tenant: {
    id: string
    slug: string
    customName: string | null
    logoUrl: string | null
  }
}
