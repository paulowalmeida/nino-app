import { describe, expect, it, vi } from 'vitest'

import { api } from '@shared/services/http/http.service'

import { OpeningHoursService } from './opening-hours.service'
import { openingHoursServiceMock } from './opening-hours.service.mock'

vi.mock('@shared/services/http/http.service', () => ({
  api: { get: vi.fn(), create: vi.fn(), patch: vi.fn(), remove: vi.fn() },
}))

describe(OpeningHoursService.listOpeningHours.name, () => {
  it('requests the tenant schedule', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: [] })
    await OpeningHoursService.listOpeningHours(openingHoursServiceMock.tenantId)
    expect(api.get).toHaveBeenCalledWith('tenants/tenant-1/opening-hours')
  })
})
