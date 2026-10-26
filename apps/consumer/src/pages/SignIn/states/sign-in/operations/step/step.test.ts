import { describe, expect, it, vi } from 'vitest'

import type { SetSignInState } from '@pages/sign-in/types/SetSignInState.type'

import {
  goToCode,
  goToCompletePhoneCode,
  goToCompleteProfile,
  goToIdentify,
  goToMethods,
} from './step'
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

  it('returns to the field of the chosen channel', () => {
    // Arrange
    const set = vi.fn() as unknown as SetSignInState
    // Act
    goToIdentify(set)
    // Assert
    expect(set).toHaveBeenCalledWith({ step: stepMock.identifyStep })
  })

  it('clears every draft when going back to the method choice', () => {
    // Arrange
    const set = vi.fn() as unknown as SetSignInState
    // Act
    goToMethods(set)
    // Assert
    expect(set).toHaveBeenCalledWith({
      step: stepMock.methodStep,
      phone: '',
      email: '',
      code: '',
    })
  })

  it('opens the profile completion step with the given name', () => {
    // Arrange
    const set = vi.fn() as unknown as SetSignInState
    // Act
    goToCompleteProfile(set, stepMock.name)
    // Assert
    expect(set).toHaveBeenCalledWith({
      step: stepMock.completeProfileStep,
      code: '',
      phone: '',
      name: stepMock.name,
    })
  })

  it('opens the phone confirmation step with an empty code', () => {
    // Arrange
    const set = vi.fn() as unknown as SetSignInState
    // Act
    goToCompletePhoneCode(set)
    // Assert
    expect(set).toHaveBeenCalledWith({
      step: stepMock.completePhoneCodeStep,
      code: '',
    })
  })
})
