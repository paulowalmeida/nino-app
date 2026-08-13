import { describe, expect, it } from 'vitest'

import { ApiError } from '@nino/lib/utils/api-error'
import { signupErrorMessage } from '@utils/signup-error-message'

const GENERIC_MESSAGE =
  'Não foi possível concluir. Confira os dados e tente de novo.'

describe(signupErrorMessage.name, () => {
  it('repeats what the API says when the data is already in use', () => {
    // Arrange
    const conflict = new ApiError(409, 'CNPJ já cadastrado')

    // Act
    const message = signupErrorMessage(conflict)

    // Assert
    expect(message).toBe('CNPJ já cadastrado')
  })

  it('falls back to the generic line on any other API failure', () => {
    // Arrange
    const serverError = new ApiError(500, 'Internal Server Error')

    // Act
    const message = signupErrorMessage(serverError)

    // Assert
    expect(message).toBe(GENERIC_MESSAGE)
  })

  it('falls back to the generic line when the network drops', () => {
    // Arrange / Act
    const message = signupErrorMessage(new Error('Failed to fetch'))

    // Assert
    expect(message).toBe(GENERIC_MESSAGE)
  })

  it('survives being handed something that is not an error', () => {
    // Arrange / Act
    const message = signupErrorMessage(undefined)

    // Assert
    expect(message).toBe(GENERIC_MESSAGE)
  })
})
