import { isValidCnpj, isValidCpf } from '@nino/ds/validators'
import { EMAIL_PATTERN } from '@shared/constants/auth.constants'

import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from '../../constants/register.constants'

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

export const COMPANY_FIELD_RULES = {
  name: { required: 'Informe o nome' },
  cnpj: {
    required: 'Informe o CNPJ',
    validate: (value: string) => isValidCnpj(value) || 'CNPJ inválido',
  },
} as const
