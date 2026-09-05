import { describe, expect, it, vi } from 'vitest'

import type { SetSignInState } from '@pages/sign-in/types/SetSignInState.type'

import { setChannel, setEmail, setPhone } from './identify-form'
import { identifyFormMock } from './identify-form.mock'

describe('identify-form operations', () => {
  it('sets the channel through the store setter', () => {
    // Arrange
    const set = vi.fn() as unknown as SetSignInState
    // Act
    setChannel(set, identifyFormMock.channel)
    // Assert
    expect(set).toHaveBeenCalledWith({
      channel: identifyFormMock.channel,
      step: 'identify',
    })
  })

  it('sets the phone draft through the store setter', () => {
    // Arrange
    const set = vi.fn() as unknown as SetSignInState
    // Act
    setPhone(set, identifyFormMock.phone)
    // Assert
    expect(set).toHaveBeenCalledWith({ phone: identifyFormMock.phone })
  })

  it('sets the email draft through the store setter', () => {
    // Arrange
    const set = vi.fn() as unknown as SetSignInState
    // Act
    setEmail(set, identifyFormMock.email)
    // Assert
    expect(set).toHaveBeenCalledWith({ email: identifyFormMock.email })
  })
})
