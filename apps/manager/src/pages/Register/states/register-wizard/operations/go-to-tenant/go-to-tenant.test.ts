import { describe, expect, it, vi } from 'vitest'

import { goToTenant } from './go-to-tenant'
import { goToTenantCompanyMock } from './go-to-tenant.mock'

describe('goToTenant', () => {
  it('keeps the company and opens the tenant step', () => {
    const set = vi.fn()

    goToTenant(set, goToTenantCompanyMock)

    expect(set).toHaveBeenCalledWith({
      step: 3,
      company: goToTenantCompanyMock,
    })
  })
})
