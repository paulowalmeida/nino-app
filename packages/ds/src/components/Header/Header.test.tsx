import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Header } from './Header'

describe(Header.name, () => {
  it('renders the title as a heading', () => {
    // Arrange / Act
    render(<Header title="Pedidos" />)

    // Assert
    expect(screen.getByRole('heading', { name: 'Pedidos' })).toBeInTheDocument()
  })

  it('renders the title as an h1 by default', () => {
    // Arrange / Act
    render(<Header title="Pedidos" />)

    // Assert
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('drops the title to the level it was given', () => {
    // Arrange / Act
    render(<Header title="Pedidos" level={2} />)

    // Assert
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
  })

  it('renders the description when provided', () => {
    // Arrange / Act
    render(<Header title="Pedidos" description="Gerencie os pedidos" />)

    // Assert
    expect(screen.getByText('Gerencie os pedidos')).toBeInTheDocument()
  })

  it('renders actions', () => {
    // Arrange / Act
    render(<Header title="Pedidos" actions={<button>Novo</button>} />)

    // Assert
    expect(screen.getByRole('button', { name: 'Novo' })).toBeInTheDocument()
  })

  it('keeps the whole title readable when accented', () => {
    // Arrange / Act
    render(<Header title="Quem toca a equipe" accent="equipe" />)

    // Assert
    expect(
      screen.getByRole('heading', { name: 'Quem toca a equipe' })
    ).toBeInTheDocument()
  })

  it('underlines the whole title, whatever accent value is passed', () => {
    // Arrange / Act
    render(<Header title="Sua sacola está vazia" accent="sacola" />)

    // Assert
    const underlined = screen.getByText('Sua sacola está vazia')
    expect(underlined.tagName).toBe('SPAN')
    expect(underlined.parentElement).toBe(screen.getByRole('heading'))
  })

  it('applies the margin props to the root', () => {
    // Arrange / Act
    const { container } = render(<Header title="Pedidos" mb={6} />)

    // Assert
    expect(container.firstChild).toHaveClass('mb-6')
  })

  it('centers title and description when asked', () => {
    // Arrange / Act
    render(<Header title="Bem-vindo" description="Entre" align="center" />)

    // Assert
    expect(screen.getByRole('heading', { name: 'Bem-vindo' })).toHaveClass(
      'text-center'
    )
    expect(screen.getByText('Entre')).toHaveClass('text-center')
  })

  it('puts the title id on the heading so a region can be named by it', () => {
    // Arrange / Act
    render(
      <Header title="Cargo" titleId="role-title" description="Quem pode" />
    )

    // Assert
    expect(screen.getByRole('heading', { name: 'Cargo' })).toHaveAttribute(
      'id',
      'role-title'
    )
  })
})
