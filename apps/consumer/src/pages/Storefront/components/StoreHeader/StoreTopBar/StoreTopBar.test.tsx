import { describe, expect, it } from 'vitest'
import { StoreTopBar } from './StoreTopBar'
import { storeTopBarMock } from './StoreTopBar.mock'

describe('StoreTopBar', () => {
  it('exports the store top bar contract', () => {
    expect(StoreTopBar).toBeDefined()
    expect(storeTopBarMock.slug).toBe('loja-do-ze')
  })
})
