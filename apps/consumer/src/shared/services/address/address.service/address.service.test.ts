import { describe, expect, it } from 'vitest'

import { addressService } from './address.service'

describe('addressService', () => {
  it('exposes the signed-in consumer address actions', () => {
    expect(addressService.listMine).toBeTypeOf('function')
    expect(addressService.createMine).toBeTypeOf('function')
    expect(addressService.updateMine).toBeTypeOf('function')
    expect(addressService.deleteMine).toBeTypeOf('function')
  })
})
