import { describe, expect, it } from 'vitest'

import { homeSectionFor } from './home-section'
import { counterOperatorMock, reportsViewerMock } from './home-section.mock'

describe('homeSectionFor', () => {
  it('opens the overview for who can view reports', () => {
    expect(homeSectionFor(reportsViewerMock)).toBe('visao-geral')
  })

  it('opens the counter for who cannot view reports', () => {
    expect(homeSectionFor(counterOperatorMock)).toBe('balcao')
  })
})
