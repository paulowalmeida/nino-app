import type { SignupAccount } from '@shared/types/auth/signup-account'

export const companyStepMock = {
  heading: 'Sua empresa',
  greeting: 'Quase lá, Maria',
  nameLabel: 'Nome',
  cnpjLabel: 'CNPJ',
  legalNameLabel: 'Razão social (opcional)',
  submitLabel: 'Continuar',
  backLabel: 'Voltar',
  rootErrorMessage:
    'Não foi possível concluir. Confira os dados e tente de novo.',
}

export const companyStepAccountMock: SignupAccount = {
  name: 'Maria Souza',
  email: 'maria@nino.delivery',
  password: 'senhaforte1',
  cpf: '12345678909',
  phone: '11999998888',
}
