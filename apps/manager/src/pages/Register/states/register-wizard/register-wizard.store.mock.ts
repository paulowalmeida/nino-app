import type { SignupAccount } from '@shared/types/auth/signup-account'
import type { SignupCompany } from '@shared/types/auth/signup-company'

export const storeAccountMock: SignupAccount = {
  name: 'Maria Souza',
  email: 'maria@nino.delivery',
  password: 'senhaforte1',
  cpf: '12345678909',
  phone: '11999998888',
}

export const storeCompanyMock: SignupCompany = {
  name: 'Padoca do Bairro',
  cnpj: '12345678000199',
}
