import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CashEmptyDay } from './CashEmptyDay'
import { cashEmptyDayMock } from './CashEmptyDay.mock'

describe(CashEmptyDay.name, () => {
  it('says plainly that nobody opened the drawer that day', () => {
    render(<CashEmptyDay />)

    expect(screen.getByText(cashEmptyDayMock.title)).toBeInTheDocument()
    expect(screen.getByText(/Escolha outro dia/)).toBeInTheDocument()
  })
})
