export type ConsumerAddress = {
  id: string
  zipCode: string
  street: string
  number: string
  complement: string | null
  neighborhood: string
  city: string
  state: string
  isPrimary: boolean | null
}
