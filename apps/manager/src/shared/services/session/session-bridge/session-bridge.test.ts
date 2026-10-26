import { describe, expect, it } from 'vitest'

import {
  clearRegisteredSession,
  registerSessionClear,
} from './session-bridge'

describe('session bridge', () => {
  it('invokes the latest registered clear callback', () => {
    let cleared = false
    registerSessionClear(() => {
      cleared = true
    })

    clearRegisteredSession()

    expect(cleared).toBe(true)
  })
})
