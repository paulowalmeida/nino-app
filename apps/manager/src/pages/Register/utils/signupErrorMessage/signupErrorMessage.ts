import { ApiError } from '@nino/lib/utils/api-error'

/* WHY: o 409 é o único caso em que a API sabe explicar melhor que a gente —
 * é ela que diz qual dado já está em uso —, então a mensagem dela passa
 * direto. */
export const signupErrorMessage = (error: unknown): string => {
  if (error instanceof ApiError && error.status === 409) return error.message

  return 'Não foi possível concluir. Confira os dados e tente de novo.'
}
