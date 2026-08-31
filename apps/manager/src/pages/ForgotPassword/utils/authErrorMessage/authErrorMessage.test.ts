import { describe, expect, it } from 'vitest'

import { ApiError } from '@nino/lib/utils/api-error'

import { authErrorMessage } from './authErrorMessage'

describe(authErrorMessage.name, () => {
  it('returns a safe connection message for unknown errors', () => {
    expect(authErrorMessage(new Error('unknown'))).toBe(
      'Falha de conexão. Verifique sua internet e tente de novo.'
    )
  })

  it('warns about rate limiting on 429', () => {
    expect(authErrorMessage(new ApiError(429, 'Too many'))).toBe(
      'Muitas tentativas. Aguarde um momento e tente de novo.'
    )
  })

  it('reports a server error on 5xx', () => {
    expect(authErrorMessage(new ApiError(500, 'Boom'))).toBe(
      'Erro no servidor. Tente novamente em instantes.'
    )
  })

  it('falls back to a generic message for other statuses', () => {
    expect(authErrorMessage(new ApiError(422, 'Invalid'))).toBe(
      'Não foi possível enviar. Tente de novo.'
    )
  })
})
