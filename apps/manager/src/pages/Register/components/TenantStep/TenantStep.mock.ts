import type { SignupAccount } from '@shared/types/auth/signup-account'
import type { SignupCompany } from '@shared/types/auth/signup-company'

export const tenantStepAccountMock: SignupAccount = {
  name: 'Maria Souza',
  email: 'maria@nino.delivery',
  password: 'senhaforte1',
  cpf: '12345678909',
  phone: '11999998888',
}

export const tenantStepCompanyMock: SignupCompany = {
  name: 'Padoca do Bairro',
  cnpj: '12345678000199',
}

export const tenantStepMock = {
  heading: 'Abra sua unidade',
  nameLabel: 'Nome da unidade',
  slugLabel: 'Endereço público',
  backLabel: 'Voltar',
  submitLabel: 'Concluir',
  failureMessage: 'Não foi possível concluir. Tente de novo.',
}
