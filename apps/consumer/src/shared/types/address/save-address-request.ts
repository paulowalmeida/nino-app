/** O que o formulário manda — o dono vem do cookie, nunca do corpo. */
export type SaveAddressRequest = {
  zipCode: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  isPrimary?: boolean
}
