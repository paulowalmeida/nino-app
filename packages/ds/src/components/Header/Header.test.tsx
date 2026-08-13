import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Header } from './Header'
import styles from './Header.module.css'

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

  it('wraps only the accent in its own element', () => {
    // Arrange / Act
    render(<Header title="Meus dados" accent="dados" />)

    // Assert
    const mark = screen.getByText('dados')
    expect(mark.tagName).toBe('SPAN')
    expect(mark).toHaveClass(styles.accent)
  })

  it('keeps an accent in the middle of the title in place', () => {
    // Arrange / Act
    render(<Header title="Sua sacola está vazia" accent="sacola" />)

    // Assert
    expect(
      screen.getByRole('heading', { name: 'Sua sacola está vazia' })
    ).toBeInTheDocument()
    expect(screen.getByText('sacola').tagName).toBe('SPAN')
  })

  it('accents a title that is a single word', () => {
    // Arrange / Act
    render(<Header title="Cardápio" accent="Cardápio" />)

    // Assert
    expect(screen.getByText('Cardápio').tagName).toBe('SPAN')
  })

  it('ignores an accent absent from the title', () => {
    // Arrange / Act
    render(<Header title="Pedidos" accent="clientes" />)

    // Assert
    expect(screen.getByRole('heading', { name: 'Pedidos' })).toBeInTheDocument()
    expect(screen.queryByText('clientes')).not.toBeInTheDocument()
  })

  it('applies the margin props to the root', () => {
    // Arrange / Act
    const { container } = render(<Header title="Pedidos" mb={6} />)

    // Assert
    expect(container.firstChild).toHaveClass('mb-6')
  })
})
