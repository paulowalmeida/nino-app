import { describe, expect, it, vi } from 'vitest'

import type { SetSignInState } from '@pages/sign-in/types/SetSignInState.type'

import { goToCode, goToIdentify } from './step'
import { stepMock } from './step.mock'

describe('step operations', () => {
  it('advances to the code step', () => {
    // Arrange
    const set = vi.fn() as unknown as SetSignInState
    // Act
    goToCode(set)
    // Assert
    expect(set).toHaveBeenCalledWith({ step: stepMock.codeStep })
  })

  it('returns to the identify step and clears the code draft', () => {
    // Arrange
    const set = vi.fn() as unknown as SetSignInState
    // Act
    goToIdentify(set)
    // Assert
    expect(set).toHaveBeenCalledWith({
      step: stepMock.identifyStep,
      phone: '',
      email: '',
      code: '',
    })
  })
})
