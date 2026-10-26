import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { deliveryZonesMock } from '@pages/PromotionEditor/adapters/zoneOptions.adapter/zoneOptions.adapter.mock'
import { useDeliveryZones } from '@shared/hooks/delivery-zone/useDeliveryZones/useDeliveryZones'

import { useZoneOptions } from './useZoneOptions'
import { zoneOptionsUnitIdMock } from './useZoneOptions.mock'

vi.mock('@shared/hooks/delivery-zone/useDeliveryZones/useDeliveryZones')

describe(useZoneOptions.name, () => {
  it('offers only the active zones of the unit', () => {
    vi.mocked(useDeliveryZones).mockReturnValue({
      zones: deliveryZonesMock,
      isPending: false,
    } as unknown as ReturnType<typeof useDeliveryZones>)

    const { result } = renderHook(() => useZoneOptions(zoneOptionsUnitIdMock))

    expect(useDeliveryZones).toHaveBeenCalledWith(zoneOptionsUnitIdMock)
    expect(result.current.zoneOptions.map(({ value }) => value)).toEqual([
      'zone-1',
      'zone-2',
    ])
  })
})
