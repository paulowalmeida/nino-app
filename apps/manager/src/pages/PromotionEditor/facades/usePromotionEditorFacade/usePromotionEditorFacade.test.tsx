import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useEditablePromotion } from '@pages/PromotionEditor/hooks/useEditablePromotion/useEditablePromotion'
import { useGiftProductOptions } from '@pages/PromotionEditor/hooks/useGiftProductOptions/useGiftProductOptions'
import { usePromotionSave } from '@pages/PromotionEditor/hooks/usePromotionSave/usePromotionSave'
import { useZoneOptions } from '@pages/PromotionEditor/hooks/useZoneOptions/useZoneOptions'
import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'
import { promotionMock } from '@shared/services/promotion/promotion.service/promotion.service.mock'

import { usePromotionEditorFacade } from './usePromotionEditorFacade'
import { editorFacadeUnitIdMock } from './usePromotionEditorFacade.mock'

vi.mock('@shared/hooks/session/useCurrentUnit/useCurrentUnit')
vi.mock(
  '@pages/PromotionEditor/hooks/useEditablePromotion/useEditablePromotion'
)
vi.mock('@pages/PromotionEditor/hooks/usePromotionSave/usePromotionSave')
vi.mock('@pages/PromotionEditor/hooks/useZoneOptions/useZoneOptions')
vi.mock(
  '@pages/PromotionEditor/hooks/useGiftProductOptions/useGiftProductOptions'
)

describe('usePromotionEditorFacade', () => {
  it('saves the campaign being edited, in the current unit', () => {
    const savePromotion = vi.fn()
    vi.mocked(useCurrentUnit).mockReturnValue({
      unitId: editorFacadeUnitIdMock,
    } as unknown as ReturnType<typeof useCurrentUnit>)
    vi.mocked(useEditablePromotion).mockReturnValue({
      mode: 'edit',
      promotion: promotionMock,
      isPending: false,
      isUnavailable: false,
    })
    vi.mocked(useZoneOptions).mockReturnValue({
      zoneOptions: [],
      isPending: true,
    })
    vi.mocked(useGiftProductOptions).mockReturnValue({
      giftProductOptions: [],
      isPending: false,
    })
    vi.mocked(usePromotionSave).mockReturnValue({
      savePromotion,
    } as unknown as ReturnType<typeof usePromotionSave>)

    const { result } = renderHook(() => usePromotionEditorFacade())

    expect(usePromotionSave).toHaveBeenCalledWith(
      editorFacadeUnitIdMock,
      'edit',
      promotionMock.id
    )
    expect(result.current.isPending).toBe(true)
    expect(result.current.savePromotion).toBe(savePromotion)
  })
})
