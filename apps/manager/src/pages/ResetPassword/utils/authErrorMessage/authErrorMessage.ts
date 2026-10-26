import { ApiError } from '@nino/lib/utils/api-error'

export const authErrorMessage = (error: unknown): string => {
  if (!(error instanceof ApiError)) {
    return 'Falha de conexão. Verifique sua internet e tente de novo.'
  }
  if (error.status === 401) {
    return 'Link inválido ou expirado. Solicite uma nova recuperação.'
  }
  if (error.status === 429) {
    return 'Muitas tentativas. Aguarde um momento e tente de novo.'
  }
  if (error.status >= 500) {
    return 'Erro no servidor. Tente novamente em instantes.'
  }
  return 'Não foi possível redefinir a senha. Tente de novo.'
}
