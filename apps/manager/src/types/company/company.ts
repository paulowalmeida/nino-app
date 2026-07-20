/** A empresa (CNPJ) dona das lojas. O CNPJ não muda depois do cadastro. */
export type Company = {
  id: string
  name: string
  cnpj: string
  legalName: string | null
  legalNature: string | null
  stateRegistration: string | null
  zipCode: string | null
  street: string | null
  number: string | null
  complement: string | null
  neighborhood: string | null
  city: string | null
  state: string | null
}
