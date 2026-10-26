import { describe, expect, it } from 'vitest'

import { resolveProfileName } from './resolveProfileName'
import { resolveProfileNameMock } from './resolveProfileName.mock'

describe('resolveProfileName', () => {
  it('keeps a real name as is', () => {
    expect(resolveProfileName(resolveProfileNameMock.realName)).toBe(
      resolveProfileNameMock.realName
    )
  })

  it('clears an email used as a placeholder name', () => {
    expect(resolveProfileName(resolveProfileNameMock.emailPlaceholder)).toBe('')
  })

  it('clears a phone used as a placeholder name', () => {
    expect(resolveProfileName(resolveProfileNameMock.phonePlaceholder)).toBe('')
  })
})
