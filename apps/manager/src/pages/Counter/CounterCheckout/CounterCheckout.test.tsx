import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { CounterCheckout } from './CounterCheckout'
import { counterCheckoutMock } from './CounterCheckout.mock'

const navigate = vi.fn()
const setSheet = vi.fn()

vi.mock('react-router', () => ({
  useNavigate: () => navigate,
}))

vi.mock('../facades/useCounterFacade/useCounterFacade', () => ({
  useCounterFacade: () => ({
    count: counterCheckoutMock.count,
    step: counterCheckoutMock.step,
    setSheet,
  }),
}))

vi.mock('../components/CounterWorkspace/SalePanel/SalePanel', () => ({
  SalePanel: () => <div>sale panel</div>,
}))

describe(CounterCheckout.name, () => {
  it('announces the sale being closed, the step and the ticket size', () => {
    render(<CounterCheckout />)

    expect(
      screen.getByRole('heading', { name: counterCheckoutMock.title })
    ).toBeInTheDocument()
    expect(screen.getByText(counterCheckoutMock.stepTitle)).toBeInTheDocument()
    expect(screen.getByText(counterCheckoutMock.stepHint)).toBeInTheDocument()
    expect(screen.getByText(counterCheckoutMock.countLabel)).toBeInTheDocument()
    expect(screen.getByText('sale panel')).toBeInTheDocument()
  })

  it('closes the sheet before going back to the products', () => {
    render(<CounterCheckout />)

    fireEvent.click(
      screen.getByRole('button', { name: 'Voltar para os produtos' })
    )

    expect(setSheet).toHaveBeenCalledWith(false)
    expect(navigate).toHaveBeenCalledWith('..')
  })
})
