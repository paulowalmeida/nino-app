import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useSubscription } from '@hooks/account/useSubscription'

import {
  AccountSubscription,
} from '@pages/account-subscription/AccountSubscription'

import { activeSubscription } from './AccountSubscription.mock'

vi.mock('@hooks/account/useSubscription')

describe(AccountSubscription.name, () => {
  it('shows the current plan once loaded', () => {
    // Arrange
    vi.mocked(useSubscription).mockReturnValue({
      data: activeSubscription,
      isPending: false,
      isError: false,
    } as unknown as ReturnType<typeof useSubscription>)

    // Act
    render(<AccountSubscription />)

    // Assert
    expect(screen.getByText('Pro')).toBeInTheDocument()
    expect(screen.getByText('Ativa')).toBeInTheDocument()
  })

  it('announces that the subscription is loading', () => {
    vi.mocked(useSubscription).mockReturnValue({
      data: undefined,
      isPending: true,
      isError: false,
    } as unknown as ReturnType<typeof useSubscription>)

    render(<AccountSubscription />)

    expect(
      screen.getByRole('status', { name: 'Carregando assinatura' })
    ).toBeInTheDocument()
  })

  it('shows an error message when the subscription fails to load', () => {
    // Arrange
    vi.mocked(useSubscription).mockReturnValue({
      data: undefined,
      isPending: false,
      isError: true,
    } as unknown as ReturnType<typeof useSubscription>)

    // Act
    render(<AccountSubscription />)

    // Assert
    expect(
      screen.getByText('Não foi possível carregar a assinatura agora.')
    ).toBeInTheDocument()
  })
})
