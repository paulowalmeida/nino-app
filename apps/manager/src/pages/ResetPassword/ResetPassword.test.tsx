import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ResetPassword } from './ResetPassword'

vi.mock('./components/ResetPasswordHeader/ResetPasswordHeader', () => ({
  ResetPasswordHeader: () => <div>header</div>,
}))
vi.mock('./components/ResetPasswordForm/ResetPasswordForm', () => ({
  ResetPasswordForm: () => <div>form</div>,
}))

describe(ResetPassword.name, () => {
  it('composes the reset-password regions', () => {
    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    )
    expect(screen.getByText('header')).toBeInTheDocument()
    expect(screen.getByText('form')).toBeInTheDocument()
  })
})
