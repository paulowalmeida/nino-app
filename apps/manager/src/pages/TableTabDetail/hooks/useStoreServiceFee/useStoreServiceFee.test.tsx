import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useSettings } from '@shared/hooks/settings/useSettings/useSettings'

import { useStoreServiceFee } from './useStoreServiceFee'
import { storeServiceFeeMock } from './useStoreServiceFee.mock'

vi.mock('@shared/hooks/settings/useSettings/useSettings')

const mockSettings = (data: unknown) =>
  vi
    .mocked(useSettings)
    .mockReturnValue({ data } as ReturnType<typeof useSettings>)

describe('useStoreServiceFee', () => {
  it('reads the store percent when the service fee is on', () => {
    mockSettings(storeServiceFeeMock.enabledSettings)

    const { result } = renderHook(() =>
      useStoreServiceFee(storeServiceFeeMock.unitId)
    )

    expect(result.current.storeServiceFeePercent).toBe(12)
    expect(useSettings).toHaveBeenCalledWith('unit-1')
  })

  it('reports no fee when the store turned it off', () => {
    mockSettings(storeServiceFeeMock.disabledSettings)

    const { result } = renderHook(() =>
      useStoreServiceFee(storeServiceFeeMock.unitId)
    )

    expect(result.current.storeServiceFeePercent).toBe(0)
  })

  it('reports no fee while the settings load', () => {
    mockSettings(undefined)

    const { result } = renderHook(() =>
      useStoreServiceFee(storeServiceFeeMock.unitId)
    )

    expect(result.current.storeServiceFeePercent).toBe(0)
  })
})
