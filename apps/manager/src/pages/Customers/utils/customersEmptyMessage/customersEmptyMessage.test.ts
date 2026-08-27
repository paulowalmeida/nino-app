import { describe, expect, it } from 'vitest'

import { customersEmptyMessage } from './customersEmptyMessage'
import { customersEmptyMessageMock } from './customersEmptyMessage.mock'

describe('customersEmptyMessage', () => {
  it('quotes the term that found nobody', () => {
    expect(customersEmptyMessage(customersEmptyMessageMock.search)).toContain(
      'Nenhum cliente com "ana"'
    )
  })

  it('invites the first order when nothing was searched', () => {
    expect(customersEmptyMessage(customersEmptyMessageMock.noSearch)).toContain(
      'Ninguém por aqui ainda.'
    )
  })
})
