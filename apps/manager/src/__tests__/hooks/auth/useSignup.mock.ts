import type { SignupRequest } from '@custom_types/auth/signup-request'
export const signupRequest: SignupRequest = {
  account: {
    name: 'Maria Silva',
    email: 'maria@nino.delivery',
    password: 'segredo123',
    cpf: '12345678900',
    phone: '85999998888',
  },
  company: {
    name: 'Padaria Boa',
    cnpj: '12345678000199',
  },
}
