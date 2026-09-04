import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useSettingsUnitDetailFacade } from './useSettingsUnitDetailFacade'

vi.mock('@pages/Units/facades/useUnitsFacade/useUnitsFacade', () => ({
  useUnitsFacade: () => ({ tenant: null }),
}))
vi.mock('../../hooks/useDeliveryLocation/useDeliveryLocation', () => ({
  useDeliveryLocation: (state: string) => ({ state }),
}))

describe(useSettingsUnitDetailFacade.name, () => {
  it('composes settings and delivery location domains', () => {
    const { result } = renderHook(() => useSettingsUnitDetailFacade('PA'))
    expect(result.current.tenant).toBeNull()
    expect(result.current.location).toEqual({ state: 'PA' })
  })
})
