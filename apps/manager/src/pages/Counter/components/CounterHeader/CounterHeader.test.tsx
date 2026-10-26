import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { CounterHeader } from './CounterHeader'
import { counterHeaderMock } from './CounterHeader.mock'

const menuState = vi.hoisted(() => ({
  sections: [],
  isPending: false,
  isError: false,
  isSuccess: true,
}))

vi.mock('@shared/hooks/product/useMenu/useMenu', () => ({
  useMenu: () => menuState,
}))

vi.mock('@shared/hooks/session/useCurrentUnit/useCurrentUnit', () => ({
  useCurrentUnit: () => ({ unitId: 'unit-1' }),
}))

describe('CounterHeader', () => {
  beforeEach(() => {
    menuState.sections = []
    menuState.isPending = false
    menuState.isError = false
    menuState.isSuccess = true
  })

  it('renders the counter heading and description', () => {
    render(<CounterHeader />)
    expect(
      screen.getByRole('heading', { name: counterHeaderMock.title })
    ).toBeInTheDocument()
    expect(screen.getByText(/Monte o pedido/)).toBeInTheDocument()
  })

  it('keeps the header skeleton until the menu query settles', () => {
    menuState.isSuccess = false

    const { container } = render(<CounterHeader />)

    expect(screen.getByRole('status')).toHaveTextContent('Carregando balcão')
    expect(
      container.querySelectorAll('[aria-hidden="true"]').length
    ).toBeGreaterThan(0)
  })
})
