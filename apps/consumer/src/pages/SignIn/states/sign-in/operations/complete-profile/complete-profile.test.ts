import { describe, expect, it, vi } from 'vitest'

import type { SetSignInState } from '@pages/sign-in/types/SetSignInState.type'

import { setName } from './complete-profile'
import { completeProfileMock } from './complete-profile.mock'

describe('complete-profile operations', () => {
  it('updates the name draft', () => {
    // Arrange
    const set = vi.fn() as unknown as SetSignInState
    // Act
    setName(set, completeProfileMock.name)
    // Assert
    expect(set).toHaveBeenCalledWith({ name: completeProfileMock.name })
  })
})
