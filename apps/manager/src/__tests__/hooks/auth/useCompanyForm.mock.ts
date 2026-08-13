import type { SignupAccount } from '@custom_types/auth/signup-account'
import type { SignupCompany } from '@custom_types/auth/signup-company'

export const signedUpAccount: SignupAccount = {
  name: 'Zé da Silva',
  email: 'ze@lanchonete.com',
  password: 'segredo123',
  cpf: '390.533.447-05',
  phone: '(11) 99999-0000',
}

export const typedCompany: SignupCompany = {
  name: 'Lanchonete do Zé',
  cnpj: '11.222.333/0001-81',
  legalName: 'Zé Alimentos LTDA',
}

export const cnpjAvailable = { cnpj: true }
export const cnpjTaken = { cnpj: false }
