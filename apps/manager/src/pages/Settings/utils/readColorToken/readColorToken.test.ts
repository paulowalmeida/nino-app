import { afterEach, describe, expect, it } from 'vitest'

import { readColorToken } from './readColorToken'
import { colorTokenMock } from './readColorToken.mock'

describe('readColorToken', () => {
  afterEach(() => {
    document.documentElement.style.removeProperty(colorTokenMock.name)
  })

  it('reads the resolved value of a color token from the document', () => {
    document.documentElement.style.setProperty(
      colorTokenMock.name,
      ` ${colorTokenMock.value} `
    )

    expect(readColorToken(colorTokenMock.name)).toBe(colorTokenMock.value)
  })

  it('returns an empty string when the token is not defined', () => {
    expect(readColorToken(colorTokenMock.name)).toBe('')
  })
})
