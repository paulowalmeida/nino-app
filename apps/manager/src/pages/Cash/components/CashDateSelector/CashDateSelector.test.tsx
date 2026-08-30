import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useCashFacade } from '../../facades/useCashFacade/useCashFacade'
import { CashDateSelector } from './CashDateSelector'
import { cashDateSelectorPastMock, cashDateSelectorTodayMock } from './CashDateSelector.mock'

vi.mock('../../facades/useCashFacade/useCashFacade')

describe(CashDateSelector.name, () => {
  const setDate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('hides the "voltar para hoje" shortcut while viewing today', () => {
    vi.mocked(useCashFacade).mockReturnValue({
      date: cashDateSelectorTodayMock,
      isToday: true,
      setDate,
    } as unknown as ReturnType<typeof useCashFacade>)

    render(<CashDateSelector />)

    expect(
      screen.queryByRole('button', { name: 'Voltar para hoje' })
    ).not.toBeInTheDocument()
  })

  it('offers a shortcut back to today while viewing a past date', async () => {
    vi.mocked(useCashFacade).mockReturnValue({
      date: cashDateSelectorPastMock,
      isToday: false,
      setDate,
    } as unknown as ReturnType<typeof useCashFacade>)

    render(<CashDateSelector />)

    await userEvent.click(
      screen.getByRole('button', { name: 'Voltar para hoje' })
    )

    expect(setDate).toHaveBeenCalledWith(undefined)
  })
})
