import { isValidCnpj, isValidCpf } from '@nino/ds/validators'

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const REGISTER_WIZARD_STEPS = [{ title: 'Conta' }, { title: 'Empresa' }]

const PASSWORD_MIN_LENGTH = 8
const PASSWORD_MAX_LENGTH = 16

/** Regras dos campos de entrar. */
export const LOGIN_FIELD_RULES = {
  email: { required: 'Informe o email' },
  password: { required: 'Informe a senha' },
} as const

/**
 * Regras dos campos da conta, no formato que o `register` do RHF espera.
 *
 * Ficam fora do JSX porque são a definição do que o formulário aceita, não
 * parte do desenho da tela: quem revisa a regra de senha não deveria precisar
 * ler markup para achá-la.
 *
 * `confirmPassword` não está aqui — a regra dele compara com o valor atual do
 * outro campo, então nasce no formulário, que é quem tem o `getValues`.
 */
export const ACCOUNT_FIELD_RULES = {
  name: { required: 'Informe o nome' },
  email: {
    required: 'Informe o email',
    pattern: { value: EMAIL_PATTERN, message: 'E-mail inválido' },
  },
  phone: { required: 'Informe o telefone' },
  cpf: {
    required: 'Informe o CPF',
    validate: (value: string) => isValidCpf(value) || 'CPF inválido',
  },
  password: {
    required: 'Informe a senha',
    minLength: {
      value: PASSWORD_MIN_LENGTH,
      message: `A senha deve ter ao menos ${PASSWORD_MIN_LENGTH} caracteres`,
    },
    maxLength: {
      value: PASSWORD_MAX_LENGTH,
      message: `A senha deve ter no máximo ${PASSWORD_MAX_LENGTH} caracteres`,
    },
  },
} as const

/** Regras dos campos da empresa, no formato que o `register` do RHF espera. */
export const COMPANY_FIELD_RULES = {
  name: { required: 'Informe o nome' },
  cnpj: {
    required: 'Informe o CNPJ',
    validate: (value: string) => isValidCnpj(value) || 'CNPJ inválido',
  },
} as const
