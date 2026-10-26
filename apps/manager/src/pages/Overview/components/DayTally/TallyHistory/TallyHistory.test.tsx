import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { TallyHistory } from './TallyHistory'
import { tallyHistoryMock } from './TallyHistory.mock'

describe('TallyHistory', () => {
  it('links recent orders to their details', () => {
    render(<TallyHistory {...tallyHistoryMock} />, { wrapper: MemoryRouter })

    expect(screen.getByRole('link')).toHaveAttribute('href', '/pedidos/order-1')
  })

  it('names the list so it reads apart from the payments above', () => {
    render(<TallyHistory {...tallyHistoryMock} />, { wrapper: MemoryRouter })

    expect(
      screen.getByRole('region', { name: 'Últimos pedidos' })
    ).toBeInTheDocument()
  })
})
