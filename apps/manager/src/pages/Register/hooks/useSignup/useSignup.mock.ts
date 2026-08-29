import type { SignupRequest } from '@shared/types/auth/signup-request'

export const signupRequestMock: SignupRequest = {
  account: {
    name: 'Maria Souza',
    email: 'maria@nino.delivery',
    password: 'senhaforte1',
    cpf: '12345678909',
    phone: '11999998888',
  },
  company: {
    name: 'Padoca do Bairro',
    cnpj: '12345678000199',
  },
  tenant: {
    slug: 'padoca-do-bairro',
    zipCode: '66000000',
    street: 'Rua das Flores',
    number: '123',
    neighborhood: 'Centro',
    city: 'Belém',
    state: 'PA',
  },
}
