import { describe, expect, it } from 'vitest'

import { customersSubtitle } from './customersSubtitle'
import { customersSubtitleMock } from './customersSubtitle.mock'

describe('customersSubtitle', () => {
  it('counts the people who already ordered in this store', () => {
    expect(customersSubtitle(customersSubtitleMock.many)).toContain(
      '42 pessoas com pedido'
    )
  })

  it('keeps the singular for a single person', () => {
    expect(customersSubtitle(customersSubtitleMock.single)).toContain(
      '1 pessoa com pedido'
    )
  })

  it('counts zero in the plural', () => {
    expect(customersSubtitle(customersSubtitleMock.none)).toContain(
      '0 pessoas com pedido'
    )
  })

  it('invites the first order while the total is unknown', () => {
    expect(customersSubtitle(undefined)).toBe(
      'Quem pede pelo app entra nesta lista.'
    )
  })
})
