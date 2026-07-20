import { ApiError } from './api-error'

export const authErrorMessage = (error: unknown): string => {
  if (!(error instanceof ApiError)) {
    return 'Falha de conexão. Verifique sua internet e tente de novo.'
  }
  if (error.status === 401) return 'E-mail ou senha incorretos.'
  if (error.status === 429) {
    return 'Muitas tentativas. Aguarde um momento e tente de novo.'
  }
  if (error.status >= 500) {
    return 'Erro no servidor. Tente novamente em instantes.'
  }
  return 'Não foi possível entrar. Tente de novo.'
}
