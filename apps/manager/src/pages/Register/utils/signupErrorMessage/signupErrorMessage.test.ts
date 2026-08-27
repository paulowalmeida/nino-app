import { describe, expect, it } from 'vitest'

import { ApiError } from '@nino/lib/utils/api-error'

import { signupErrorMessage } from './signupErrorMessage'
import { signupErrorMessageMock } from './signupErrorMessage.mock'

describe('signupErrorMessage', () => {
  it('repeats what the API said about the duplicated data', () => {
    const conflict = new ApiError(409, signupErrorMessageMock.conflictMessage)

    expect(signupErrorMessage(conflict)).toBe(
      signupErrorMessageMock.conflictMessage
    )
  })

  it('falls back to one sentence for any other failure', () => {
    expect(signupErrorMessage(new Error('offline'))).toBe(
      signupErrorMessageMock.fallback
    )
  })

  it('falls back when the API fails with another status', () => {
    const serverError = new ApiError(500, 'boom')

    expect(signupErrorMessage(serverError)).toBe(
      signupErrorMessageMock.fallback
    )
  })
})
