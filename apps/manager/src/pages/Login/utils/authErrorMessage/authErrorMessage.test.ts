import { describe, expect, it } from 'vitest'

import { authErrorMessage } from './authErrorMessage'

describe(authErrorMessage.name, () => {
  it('returns a safe authentication message for unknown errors', () => {
    expect(authErrorMessage(new Error('unknown'))).toBe(
      'Falha de conexão. Verifique sua internet e tente de novo.'
    )
  })
})
