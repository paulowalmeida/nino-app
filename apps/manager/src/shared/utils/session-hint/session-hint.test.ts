import { afterEach, describe, expect, it, vi } from 'vitest'

import { forgetSession, hadSession, rememberSession } from './session-hint'

describe('session-hint', () => {
  afterEach(() => window.localStorage.clear())

  it('has no prior session before one is remembered', () => {
    expect(hadSession()).toBe(false)
  })

  it('remembers a session once it starts', () => {
    rememberSession()
    expect(hadSession()).toBe(true)
  })

  it('forgets the session on logout', () => {
    // Arrange
    rememberSession()

    // Act
    forgetSession()

    // Assert
    expect(hadSession()).toBe(false)
  })

  it('assumes a session is worth retrying when storage is unavailable', () => {
    // Arrange
    const getItem = vi
      .spyOn(window.localStorage.__proto__, 'getItem')
      .mockImplementation(() => {
        throw new Error('storage blocked')
      })

    // Act / Assert
    expect(hadSession()).toBe(true)

    getItem.mockRestore()
  })
})
