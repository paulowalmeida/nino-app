import { describe, expect, it } from 'vitest'

import { consumersEmptyMessage } from './consumersEmptyMessage'
import { consumersEmptyMessageMock } from './consumersEmptyMessage.mock'

describe('consumersEmptyMessage', () => {
  it('quotes the term that found nobody', () => {
    expect(consumersEmptyMessage(consumersEmptyMessageMock.search)).toContain(
      'Nenhum cliente com "ana"'
    )
  })

  it('invites the first order when nothing was searched', () => {
    expect(consumersEmptyMessage(consumersEmptyMessageMock.noSearch)).toContain(
      'Ninguém por aqui ainda.'
    )
  })
})
