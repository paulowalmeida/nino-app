import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'

import { Login } from '@pages/login/Login'

vi.mock('@organisms/LoginForm/LoginForm', () => ({
  LoginForm: () => <p>formulário de entrar</p>,
}))

const renderPage = () =>
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  )

describe(Login.name, () => {
  it('shows the welcome title', () => {
    // Arrange / Act
    renderPage()

    // Assert
    expect(
      screen.getByRole('heading', { name: 'Bem-vindo' })
    ).toBeInTheDocument()
  })

  it('renders the login form', () => {
    // Arrange / Act
    renderPage()

    // Assert
    expect(screen.getByText('formulário de entrar')).toBeInTheDocument()
  })

  it('links to the signup page for people with no account', () => {
    // Arrange / Act
    renderPage()

    // Assert
    expect(screen.getByRole('link', { name: 'Criar conta' })).toHaveAttribute(
      'href',
      '/cadastrar'
    )
  })
})
