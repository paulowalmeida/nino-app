import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import {
  useAccountFacade,
} from '@pages/account/facades/useAccountFacade/useAccountFacade'

import { Profile } from './Profile'
import { profileMock } from './Profile.mock'

vi.mock('@pages/account/facades/useAccountFacade/useAccountFacade')

const facadeWith = (overrides: Record<string, unknown>) =>
  vi.mocked(useAccountFacade).mockReturnValue({
    customer: profileMock.customer,
    completeProfile: vi.fn(),
    isCompletingProfile: false,
    ...overrides,
  } as unknown as ReturnType<typeof useAccountFacade>)

describe('Profile', () => {
  it('shows the phone as read-only, never as an editable field', () => {
    // Arrange
    facadeWith({})

    // Act
    render(<Profile />)

    // Assert
    expect(
      screen.queryByRole('textbox', { name: 'Telefone' })
    ).not.toBeInTheDocument()
    expect(screen.getByText('(11) 98765-4321')).toBeInTheDocument()
  })

  it('keeps the save button disabled until something changes', () => {
    // Arrange
    facadeWith({})

    // Act
    render(<Profile />)

    // Assert
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeDisabled()
  })

  it('submits the trimmed name and email once the form is ready', () => {
    // Arrange
    const completeProfile = vi.fn()
    facadeWith({ completeProfile })

    // Act
    render(<Profile />)
    fireEvent.change(screen.getByLabelText('Nome'), {
      target: { value: '  Maria Nova  ' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }))

    // Assert
    expect(completeProfile).toHaveBeenCalledWith(
      { name: 'Maria Nova', email: profileMock.customer.email },
      expect.any(Object)
    )
  })

  it('rejects a name shorter than two characters', () => {
    // Arrange
    facadeWith({})

    // Act
    render(<Profile />)
    fireEvent.change(screen.getByLabelText('Nome'), {
      target: { value: 'M' },
    })

    // Assert
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeDisabled()
  })
})
