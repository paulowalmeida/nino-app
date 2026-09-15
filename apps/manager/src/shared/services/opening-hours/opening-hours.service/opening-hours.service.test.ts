import { describe, expect, it, vi } from 'vitest'

import { api } from '@shared/services/http/http.service'

import { OpeningHoursService } from './opening-hours.service'
import { openingHoursServiceMock } from './opening-hours.service.mock'

vi.mock('@shared/services/http/http.service', () => ({
  api: { get: vi.fn(), create: vi.fn(), patch: vi.fn(), remove: vi.fn() },
}))

describe(OpeningHoursService.listOpeningHours.name, () => {
  it('requests the unit schedule', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: [] })
    await OpeningHoursService.listOpeningHours(openingHoursServiceMock.unitId)
    expect(api.get).toHaveBeenCalledWith('units/unit-1/opening-hours')
  })
})
