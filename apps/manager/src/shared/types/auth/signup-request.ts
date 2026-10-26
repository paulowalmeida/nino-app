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
  unit: {
    customName?: string
    slug: string
    zipCode: string
    street: string
    number: string
    complement?: string
    neighborhood: string
    city: string
    state: string
    country?: string
    timezone?: string
  }
}
