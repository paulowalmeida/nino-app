import { describe, expect, it, vi } from 'vitest'

import { setCurrentTenant } from './set-current-tenant'
import { setCurrentTenantMock } from './set-current-tenant.mock'

describe(setCurrentTenant.name, () => {
  it('remembers which tenant the shell is showing', () => {
    const set = vi.fn()

    setCurrentTenant(set, setCurrentTenantMock.tenantId)

    expect(set).toHaveBeenCalledWith({
      currentTenantId: setCurrentTenantMock.tenantId,
    })
  })

  it('clears the tenant when none is selected', () => {
    const set = vi.fn()

    setCurrentTenant(set, null)

    expect(set).toHaveBeenCalledWith({ currentTenantId: null })
  })
})
