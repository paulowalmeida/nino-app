import { expect, it } from 'vitest'
import { forgetSession, hadSession, rememberSession } from './session-hint'
it('remembers a session', () => {
  forgetSession()
  rememberSession()
  expect(hadSession()).toBe(true)
})
