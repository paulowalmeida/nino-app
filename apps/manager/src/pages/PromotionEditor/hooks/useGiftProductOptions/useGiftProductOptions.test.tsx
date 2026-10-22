import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { giftMenuMock } from '@pages/PromotionEditor/adapters/giftProductOptions.adapter/giftProductOptions.adapter.mock'
import { useMenu } from '@shared/hooks/product/useMenu/useMenu'

import { useGiftProductOptions } from './useGiftProductOptions'
import { giftOptionsUnitIdMock } from './useGiftProductOptions.mock'

vi.mock('@shared/hooks/product/useMenu/useMenu')

describe(useGiftProductOptions.name, () => {
  it('turns the unit menu into gift product options', () => {
    vi.mocked(useMenu).mockReturnValue({
      data: { data: giftMenuMock },
      isPending: false,
    } as unknown as ReturnType<typeof useMenu>)

    const { result } = renderHook(() => useGiftProductOptions(giftOptionsUnitIdMock))

    expect(useMenu).toHaveBeenCalledWith(giftOptionsUnitIdMock)
    expect(result.current.giftProductOptions.map(({ value }) => value)).toEqual([
      'coke',
    ])
  })
})
