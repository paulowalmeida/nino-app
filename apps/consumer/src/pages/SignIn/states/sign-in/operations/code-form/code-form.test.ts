import { describe, expect, it, vi } from 'vitest'

import type { SetSignInState } from '@pages/sign-in/types/SetSignInState.type'

import { setCode } from './code-form'
import { codeFormMock } from './code-form.mock'

describe('code-form operations', () => {
  it('sets the code draft through the store setter', () => {
    // Arrange
    const set = vi.fn() as unknown as SetSignInState
    // Act
    setCode(set, codeFormMock.code)
    // Assert
    expect(set).toHaveBeenCalledWith({ code: codeFormMock.code })
  })
})
