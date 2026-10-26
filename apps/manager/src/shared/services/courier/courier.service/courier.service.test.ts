import { afterEach, describe, expect, it, vi } from 'vitest'

import { api } from '@shared/services/http/http.service'

import { CourierService } from './courier.service'
import { courierIdMock, courierUnitIdMock } from './courier.service.mock'

vi.mock('@shared/services/http/http.service', () => ({
  api: { get: vi.fn(), remove: vi.fn() },
}))

describe(CourierService.removeCourier.name, () => {
  afterEach(() => vi.clearAllMocks())

  it('removes only the courier belonging to the selected unit', async () => {
    vi.mocked(api.remove).mockResolvedValue(undefined)

    await CourierService.removeCourier(courierUnitIdMock, courierIdMock)

    expect(api.remove).toHaveBeenCalledWith(
      `units/${courierUnitIdMock}/couriers/${courierIdMock}`
    )
  })
})
