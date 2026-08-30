import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CashSkeleton } from './CashSkeleton'
import {
  cashSkeletonActionCountMock,
  cashSkeletonFigureCountMock,
} from './CashSkeleton.mock'

describe(CashSkeleton.name, () => {
  it('announces that the drawer is still loading', () => {
    render(<CashSkeleton />)

    expect(screen.getByLabelText('Carregando o caixa')).toBeInTheDocument()
  })

  it('mirrors the figures and the actions of the real screen', () => {
    const { container } = render(<CashSkeleton />)

    const placeholders = container.querySelectorAll('[class]')
    expect(placeholders.length).toBeGreaterThanOrEqual(
      cashSkeletonFigureCountMock + cashSkeletonActionCountMock
    )
  })
})
