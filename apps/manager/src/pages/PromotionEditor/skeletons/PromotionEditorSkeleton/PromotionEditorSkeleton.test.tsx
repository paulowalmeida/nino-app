import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { PromotionEditorSkeleton } from './PromotionEditorSkeleton'
import { promotionEditorSkeletonMock } from './PromotionEditorSkeleton.mock'

describe(PromotionEditorSkeleton.name, () => {
  it('announces the loading form', () => {
    render(<PromotionEditorSkeleton />)

    expect(
      screen.getByLabelText(promotionEditorSkeletonMock.label)
    ).toHaveAttribute('aria-busy', 'true')
  })
})
