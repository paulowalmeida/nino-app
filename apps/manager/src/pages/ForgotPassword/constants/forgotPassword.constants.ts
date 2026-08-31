import { EMAIL_PATTERN } from '@shared/constants/auth.constants'

export const RESET_LINK_TTL_LABEL = '1 hora'

export const FORGOT_PASSWORD_FIELD_RULES = {
  email: {
    required: 'Informe o email',
    pattern: { value: EMAIL_PATTERN, message: 'E-mail inválido' },
  },
} as const
