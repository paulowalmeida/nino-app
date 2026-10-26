import { afterEach, describe, expect, it, vi } from 'vitest'

import { rememberOnboarding, sawOnboarding } from './onboarding-seen'

describe('onboarding-seen', () => {
  afterEach(() => window.localStorage.clear())

  it('has not seen onboarding before it is remembered', () => {
    expect(sawOnboarding()).toBe(false)
  })

  it('remembers onboarding once it has been shown', () => {
    rememberOnboarding()
    expect(sawOnboarding()).toBe(true)
  })

  it('reads false instead of throwing when storage is unavailable', () => {
    // Arrange
    const getItem = vi
      .spyOn(window.localStorage.__proto__, 'getItem')
      .mockImplementation(() => {
        throw new Error('storage blocked')
      })

    // Act / Assert
    expect(sawOnboarding()).toBe(false)

    getItem.mockRestore()
  })
})
