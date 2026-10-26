import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CashHeader } from './CashHeader'
import { cashHeaderMock } from './CashHeader.mock'

describe(CashHeader.name, () => {
  it('titles the screen', () => {
    render(<CashHeader />)

    expect(
      screen.getByRole('heading', { name: new RegExp(cashHeaderMock.title) })
    ).toBeInTheDocument()
  })
})
