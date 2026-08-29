import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router'

import {
  useAccountFacade,
} from '@pages/account/facades/useAccountFacade/useAccountFacade'
import { useScrollProgress } from '@hooks/useScrollProgress'

import { Account } from './Account'
import { accountMock } from './Account.mock'

vi.mock('@pages/account/facades/useAccountFacade/useAccountFacade')
vi.mock('@hooks/useScrollProgress')
vi.mock('@compositions/TabBar/TabBar', () => ({ TabBar: () => null }))

const facadeWith = (overrides: Record<string, unknown>) =>
  vi.mocked(useAccountFacade).mockReturnValue({
    customer: accountMock.customer,
    isSessionPending: false,
    tint: undefined,
    orders: [],
    isOrdersPending: false,
    addresses: [],
    isAddressesPending: false,
    logout: vi.fn(),
    isLoggingOut: false,
    saveAddress: vi.fn(),
    isSavingAddress: false,
    hasSaveAddressError: false,
    deleteAddress: vi.fn(),
    isDeletingAddress: false,
    completeProfile: vi.fn(),
    isCompletingProfile: false,
    ...overrides,
  } as unknown as ReturnType<typeof useAccountFacade>)

const renderAccount = () =>
  render(
    <MemoryRouter initialEntries={['/conta']}>
      <Routes>
        <Route path="/conta" element={<Account />} />
        <Route path="/entrar" element={<p>Tela de entrada</p>} />
      </Routes>
    </MemoryRouter>
  )

describe('Account', () => {
  it('shows the loading skeleton while the session is pending', () => {
    // Arrange
    facadeWith({ isSessionPending: true, customer: null })
    vi.mocked(useScrollProgress).mockReturnValue(0)

    // Act
    renderAccount()

    // Assert
    expect(screen.getByLabelText('Carregando a conta')).toBeInTheDocument()
  })

  it('redirects to sign-in when there is no customer session', () => {
    // Arrange
    facadeWith({ isSessionPending: false, customer: null })
    vi.mocked(useScrollProgress).mockReturnValue(0)

    // Act
    renderAccount()

    // Assert
    expect(screen.getByText('Tela de entrada')).toBeInTheDocument()
  })

  it('greets the customer once the session is ready', () => {
    // Arrange
    facadeWith({ customer: accountMock.customer })
    vi.mocked(useScrollProgress).mockReturnValue(0)

    // Act
    renderAccount()

    // Assert
    expect(screen.getByText(/Maria/)).toBeInTheDocument()
  })

  it('tints the shell with the store color when it is available', () => {
    // Arrange
    facadeWith({ customer: accountMock.customer, tint: '#ff7a45' })
    vi.mocked(useScrollProgress).mockReturnValue(0)

    // Act
    const { container } = renderAccount()

    // Assert
    expect(container.firstChild).toHaveStyle({ '--store-tint': '#ff7a45' })
  })
})
