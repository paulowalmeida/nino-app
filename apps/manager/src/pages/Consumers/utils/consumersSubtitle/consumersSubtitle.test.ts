import { describe, expect, it } from 'vitest'

import { consumersSubtitle } from './consumersSubtitle'
import { consumersSubtitleMock } from './consumersSubtitle.mock'

describe('consumersSubtitle', () => {
  it('counts the people who already ordered in this store', () => {
    expect(consumersSubtitle(consumersSubtitleMock.many)).toContain(
      '42 pessoas com pedido'
    )
  })

  it('keeps the singular for a single person', () => {
    expect(consumersSubtitle(consumersSubtitleMock.single)).toContain(
      '1 pessoa com pedido'
    )
  })

  it('counts zero in the plural', () => {
    expect(consumersSubtitle(consumersSubtitleMock.none)).toContain(
      '0 pessoas com pedido'
    )
  })

  it('invites the first order while the total is unknown', () => {
    expect(consumersSubtitle(undefined)).toBe(
      'Quem pede pelo app entra nesta lista.'
    )
  })
})
