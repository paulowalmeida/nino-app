import { describe, expect, it } from 'vitest'

import { consumerAuthService } from './consumer-auth.service'

describe('consumerAuthService', () => {
  it('exposes the consumer authentication resource actions', () => {
    expect(consumerAuthService.requestOtp).toBeTypeOf('function')
    expect(consumerAuthService.verifyOtp).toBeTypeOf('function')
    expect(consumerAuthService.getMe).toBeTypeOf('function')
  })
})
