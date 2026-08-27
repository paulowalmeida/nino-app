export type CreateStoreRequest = {
  slug: string
  typeId: string
  zipCode: string
  street: string
  number: string
  neighborhood: string
  city: string
  state: string
  complement?: string
  customName?: string
}
