export type CompleteOnboardingRequest = {
  company: {
    name: string
    cnpj: string
    legalName?: string
  }
  responsible: {
    name: string
    cpf: string
    email: string
    phone: string
  }
}
