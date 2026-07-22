/** A loja como a vitrine a recebe de `GET /tenants/slug/:slug`. */
export type Store = {
  id: string
  slug: string
  customName: string | null
  logoUrl: string | null
  primaryColor: string | null
  isPaused: boolean
  timezone: string
  street: string
  number: string
  neighborhood: string
  city: string
  state: string
  status: { name: string }
  company: { name: string }
}
