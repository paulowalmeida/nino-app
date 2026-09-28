import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'

import { AccountChats } from './AccountChats'

vi.mock('@hooks/useGuestOrderStatus/useGuestOrderStatus', () => ({
  useGuestOrderStatus: () => ({
    data: undefined,
    isPending: false,
    isError: false,
  }),
}))

describe('AccountChats', () => {
  it('opens the public notifications screen without a previous order', () => {
    // Arrange
    // Act
    render(
      <MemoryRouter>
        <AccountChats />
      </MemoryRouter>
    )

    // Assert
    expect(
      screen.getByText('Nenhum pedido em acompanhamento')
    ).toBeInTheDocument()
  })
})
