import { describe, expect, it } from 'vitest'

import { ApiError } from '@nino/lib/utils/api-error'

import { promotionUnavailableFee } from './promotion-unavailable'
import {
  idempotencyConflictBodyMock,
  promotionUnavailableBodyMock,
} from './promotion-unavailable.mock'

describe(promotionUnavailableFee.name, () => {
  it('reads the new delivery fee when the campaign ended', () => {
    expect(
      promotionUnavailableFee(
        new ApiError(409, promotionUnavailableBodyMock.message, promotionUnavailableBodyMock)
      )
    ).toBe(7)
  })

  it('ignores other conflicts and other errors', () => {
    expect(
      promotionUnavailableFee(
        new ApiError(409, idempotencyConflictBodyMock.message, idempotencyConflictBodyMock)
      )
    ).toBeNull()
    expect(promotionUnavailableFee(new ApiError(500, 'erro'))).toBeNull()
    expect(promotionUnavailableFee(new Error('rede'))).toBeNull()
  })
})
