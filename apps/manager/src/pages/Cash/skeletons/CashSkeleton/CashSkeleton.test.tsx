import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CashSkeleton } from './CashSkeleton'

describe(CashSkeleton.name, () => {
  it('announces that the drawer is still loading', () => {
    render(<CashSkeleton />)

    expect(screen.getByLabelText('Carregando o caixa')).toBeInTheDocument()
  })

  it('mirrors the header, summary, actions, and movements of the real screen', () => {
    const { container } = render(<CashSkeleton />)

    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(41)
    expect(container.querySelectorAll('[class*="tableRow"]')).toHaveLength(4)
  })
})
