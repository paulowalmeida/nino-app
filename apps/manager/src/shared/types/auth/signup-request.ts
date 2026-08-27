export type SignupRequest = {
  account: {
    name: string
    email: string
    password: string
    cpf: string
    phone: string
  }
  company: {
    name: string
    cnpj: string
    legalName?: string
  }
}
