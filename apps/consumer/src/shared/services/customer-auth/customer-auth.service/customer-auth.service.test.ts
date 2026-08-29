import { describe, expect, it } from 'vitest'

import { customerAuthService } from './customer-auth.service'

describe('customerAuthService', () => {
  it('exposes the customer authentication resource actions', () => {
    expect(customerAuthService.requestOtp).toBeTypeOf('function')
    expect(customerAuthService.verifyOtp).toBeTypeOf('function')
    expect(customerAuthService.getMe).toBeTypeOf('function')
  })
})
