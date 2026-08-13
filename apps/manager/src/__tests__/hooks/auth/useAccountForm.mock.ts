import type { SignupAccount } from '@custom_types/auth/signup-account'

export const filledAccount: SignupAccount = {
  name: 'Zé da Silva',
  email: 'ze@lanchonete.com',
  password: 'segredo123',
  cpf: '390.533.447-05',
  phone: '(11) 99999-0000',
}

export const bothAvailable = { email: true, cpf: true }
export const emailTaken = { email: false, cpf: true }
export const cpfTaken = { email: true, cpf: false }
