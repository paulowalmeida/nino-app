export const PASSWORD_MIN_LENGTH = 8
export const PASSWORD_MAX_LENGTH = 16

export const RESET_PASSWORD_FIELD_RULES = {
  password: {
    required: 'Informe a nova senha',
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
