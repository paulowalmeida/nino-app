import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Login } from './Login'

vi.mock('./components/LoginHeader/LoginHeader', () => ({
  LoginHeader: () => <div>header</div>,
}))
vi.mock('./components/LoginForm/LoginForm', () => ({
  LoginForm: () => <div>form</div>,
}))
vi.mock('./components/LoginFooter/LoginFooter', () => ({
  LoginFooter: () => <div>footer</div>,
}))

describe(Login.name, () => {
  it('composes the login regions', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )
    expect(screen.getByText('header')).toBeInTheDocument()
    expect(screen.getByText('form')).toBeInTheDocument()
    expect(screen.getByText('footer')).toBeInTheDocument()
  })
})
