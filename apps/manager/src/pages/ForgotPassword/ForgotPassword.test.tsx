import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ForgotPassword } from './ForgotPassword'

vi.mock('./components/ForgotPasswordHeader/ForgotPasswordHeader', () => ({
  ForgotPasswordHeader: () => <div>header</div>,
}))
vi.mock('./components/ForgotPasswordForm/ForgotPasswordForm', () => ({
  ForgotPasswordForm: () => <div>form</div>,
}))
vi.mock('./components/ForgotPasswordFooter/ForgotPasswordFooter', () => ({
  ForgotPasswordFooter: () => <div>footer</div>,
}))

describe(ForgotPassword.name, () => {
  it('composes the forgot-password regions', () => {
    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    )
    expect(screen.getByText('header')).toBeInTheDocument()
    expect(screen.getByText('form')).toBeInTheDocument()
    expect(screen.getByText('footer')).toBeInTheDocument()
  })
})
