export type AddressValue = {
  zipCode: string
  street: string
  number: string
  complement: string
  neighborhood: string
  city: string
  state: string
}

export type AddressFieldsProps = {
  value: AddressValue
  onChange: (patch: Partial<AddressValue>) => void
}
