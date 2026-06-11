export type CheckAvailabilityRequest = {
  email?: string
  cpf?: string
  cnpj?: string
}

export type CheckAvailabilityResponse = {
  email?: boolean
  cpf?: boolean
  cnpj?: boolean
}
