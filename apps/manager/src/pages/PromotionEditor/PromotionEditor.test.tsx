import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { usePromotionEditorFacade } from '@pages/PromotionEditor/facades/usePromotionEditorFacade/usePromotionEditorFacade'

import { PromotionEditor } from './PromotionEditor'
import { promotionEditorPageMock } from './PromotionEditor.mock'

vi.mock(
  '@pages/PromotionEditor/facades/usePromotionEditorFacade/usePromotionEditorFacade'
)
vi.mock(
  '@pages/PromotionEditor/components/PromotionEditorHeader/PromotionEditorHeader',
  () => ({ PromotionEditorHeader: () => <div>editor header</div> })
)
vi.mock(
  '@pages/PromotionEditor/components/PromotionEditorForm/PromotionEditorForm',
  () => ({ PromotionEditorForm: () => <div>campaign form</div> })
)
vi.mock(
  '@pages/PromotionEditor/components/PromotionUnavailable/PromotionUnavailable',
  () => ({ PromotionUnavailable: () => <div>campaign unavailable</div> })
)
vi.mock(
  '@pages/PromotionEditor/skeletons/PromotionEditorSkeleton/PromotionEditorSkeleton',
  () => ({ PromotionEditorSkeleton: () => <div>loading form</div> })
)

const withFacade = (state: { isPending: boolean; isUnavailable: boolean }) =>
  vi
    .mocked(usePromotionEditorFacade)
    .mockReturnValue(
      state as unknown as ReturnType<typeof usePromotionEditorFacade>
    )

describe('PromotionEditor', () => {
  beforeEach(() => vi.clearAllMocks())

  it('opens the campaign form under the header', () => {
    withFacade({ isPending: false, isUnavailable: false })

    render(<PromotionEditor />)

    expect(screen.getByText(promotionEditorPageMock.header)).toBeInTheDocument()
    expect(screen.getByText(promotionEditorPageMock.form)).toBeInTheDocument()
  })

  it('holds the form while the campaign and zones load', () => {
    withFacade({ isPending: true, isUnavailable: false })

    render(<PromotionEditor />)

    expect(
      screen.getByText(promotionEditorPageMock.skeleton)
    ).toBeInTheDocument()
  })

  it('explains why a used or missing campaign cannot be edited', () => {
    withFacade({ isPending: false, isUnavailable: true })

    render(<PromotionEditor />)

    expect(
      screen.getByText(promotionEditorPageMock.unavailable)
    ).toBeInTheDocument()
    expect(
      screen.queryByText(promotionEditorPageMock.form)
    ).not.toBeInTheDocument()
  })
})
