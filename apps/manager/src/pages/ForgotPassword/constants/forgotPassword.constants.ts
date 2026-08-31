import { EMAIL_PATTERN } from '@shared/constants/auth.constants'

export const FORGOT_PASSWORD_FIELD_RULES = {
  email: {
    required: 'Informe o email',
    pattern: { value: EMAIL_PATTERN, message: 'E-mail inválido' },
  },
} as const
