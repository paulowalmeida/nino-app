import type { SignupAccount } from '@shared/types/auth/signup-account'

export const accountDefaultsMock: SignupAccount = {
  name: 'Maria Souza',
  email: 'maria@nino.delivery',
  password: 'senhaforte1',
  cpf: '12345678909',
  phone: '11999998888',
}

export const accountFormMock = {
  takenEmailMessage: 'E-mail já cadastrado',
  takenCpfMessage: 'CPF já cadastrado',
  checkFailedMessage: 'Não foi possível validar os dados. Tente de novo.',
}
