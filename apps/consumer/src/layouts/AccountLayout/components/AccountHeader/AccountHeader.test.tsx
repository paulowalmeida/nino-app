import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router'

import { useAccountLayoutFacade } from '../../facades/useAccountLayoutFacade/useAccountLayoutFacade'

import { AccountHeader } from './AccountHeader'
import { accountHeaderMock } from './AccountHeader.mock'

vi.mock('../../facades/useAccountLayoutFacade/useAccountLayoutFacade')

const facadeWith = (overrides: Record<string, unknown>) =>
  vi.mocked(useAccountLayoutFacade).mockReturnValue({
    customer: accountHeaderMock.customer,
    ...overrides,
  } as unknown as ReturnType<typeof useAccountLayoutFacade>)

const renderHeader = (initialEntry = '/loja/conta/dados') =>
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/:slug/conta/dados" element={<AccountHeader />} />
      </Routes>
    </MemoryRouter>
  )

describe('AccountHeader', () => {
  it('renders nothing when there is no customer session', () => {
    // Arrange
    facadeWith({ customer: null })

    // Act
    const { container } = renderHeader()

    // Assert
    expect(container).toBeEmptyDOMElement()
  })

  it('greets the customer by first name once the profile is complete', () => {
    // Arrange
    facadeWith({})

    // Act
    renderHeader()

    // Assert
    expect(screen.getByText(/Maria/)).toBeInTheDocument()
  })

  it('links back to the store scoped by slug', () => {
    // Arrange
    facadeWith({})

    // Act
    renderHeader()

    // Assert
    expect(
      screen.getByRole('link', { name: 'Voltar para a loja' })
    ).toHaveAttribute('href', '/loja')
  })
})
