import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useProfileFacade } from '@pages/Profile/facades/useProfileFacade/useProfileFacade'

import { AccountProfilePhoneField } from './AccountProfilePhoneField'
import { accountProfilePhoneFieldMock } from './AccountProfilePhoneField.mock'

vi.mock('@pages/Profile/facades/useProfileFacade/useProfileFacade')

const facadeWith = (overrides: Record<string, unknown>) =>
  vi.mocked(useProfileFacade).mockReturnValue({
    customer: accountProfilePhoneFieldMock.customerWithoutPhone,
    requestPhoneLink: vi.fn(),
    isRequestingPhoneLink: false,
    requestPhoneLinkFailed: false,
    verifyPhoneLink: vi.fn(),
    isVerifyingPhoneLink: false,
    verifyPhoneLinkFailed: false,
    ...overrides,
  } as unknown as ReturnType<typeof useProfileFacade>)

describe('AccountProfilePhoneField', () => {
  it('shows the phone as read-only once the account already has one', () => {
    // Arrange
    facadeWith({ customer: accountProfilePhoneFieldMock.customerWithPhone })

    // Act
    render(<AccountProfilePhoneField />)

    // Assert
    expect(
      screen.queryByRole('textbox', { name: 'Telefone' })
    ).not.toBeInTheDocument()
    expect(screen.getByText('(11) 98765-4321')).toBeInTheDocument()
  })

  it('offers to add a phone when the account has none', () => {
    // Arrange
    facadeWith({})

    // Act
    render(<AccountProfilePhoneField />)

    // Assert
    expect(screen.getByRole('button', { name: 'Adicionar' })).toBeDisabled()
  })

  it('requests a code once a complete phone is typed', () => {
    // Arrange
    const requestPhoneLink = vi.fn()
    facadeWith({ requestPhoneLink })

    // Act
    render(<AccountProfilePhoneField />)
    fireEvent.change(screen.getByLabelText('Telefone'), {
      target: { value: '91988881234' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar' }))

    // Assert
    expect(requestPhoneLink).toHaveBeenCalledWith(
      { phone: '+5591988881234' },
      expect.any(Object)
    )
  })

  it('shows the code step once the link code was requested', () => {
    // Arrange
    const requestPhoneLink = vi.fn((_data, options) => options.onSuccess())
    facadeWith({ requestPhoneLink })

    // Act
    render(<AccountProfilePhoneField />)
    fireEvent.change(screen.getByLabelText('Telefone'), {
      target: { value: '91988881234' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar' }))

    // Assert
    expect(screen.getByText(/Enviamos um código/)).toBeInTheDocument()
  })

  it('shows an alert when requesting the code fails', () => {
    // Arrange
    facadeWith({ requestPhoneLinkFailed: true })

    // Act
    render(<AccountProfilePhoneField />)

    // Assert
    expect(
      screen.getByText(
        'Não conseguimos enviar o código agora. Tente de novo em instantes.'
      )
    ).toBeInTheDocument()
  })
})
