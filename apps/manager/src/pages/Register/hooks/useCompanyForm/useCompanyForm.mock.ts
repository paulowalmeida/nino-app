import type { SignupAccount } from '@shared/types/auth/signup-account'
import type { SignupCompany } from '@shared/types/auth/signup-company'

export const companyAccountMock: SignupAccount = {
  name: 'Maria Souza',
  email: 'maria@nino.delivery',
  password: 'senhaforte1',
  cpf: '12345678909',
  phone: '11999998888',
}

export const companyValuesMock: SignupCompany = {
  name: 'Lanchonete do Zé',
  cnpj: '12345678000199',
  legalName: 'Zé Alimentos LTDA',
}

export const companyFormMock = {
  takenCnpjMessage: 'CNPJ já cadastrado',
  failureMessage: 'Não foi possível concluir. Confira os dados e tente de novo.',
  home: '/',
}
