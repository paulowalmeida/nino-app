/** A unidade como ela é cadastrada — endereço, marca e link público. */
export type TenantDetail = {
  id: string
  /** Matriz da empresa. Uma só, garantida por unique no banco. */
  isMain: boolean | null
  customName: string | null
  slug: string
  logoUrl: string | null
  primaryColor: string | null
  timezone: string
  zipCode: string
  street: string
  number: string
  complement: string | null
  neighborhood: string
  city: string
  state: string
}
