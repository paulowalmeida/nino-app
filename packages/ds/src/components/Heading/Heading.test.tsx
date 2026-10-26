import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Heading } from './Heading'
import styles from './Heading.module.css'

describe(Heading.name, () => {
  it('renders the content', () => {
    // Arrange / Act
    render(<Heading level={1}>Configurações</Heading>)

    // Assert
    expect(screen.getByText('Configurações')).toBeInTheDocument()
  })

  it.each([1, 2, 3, 4, 5, 6] as const)(
    'renders level %s as its tag',
    (level) => {
      // Arrange / Act
      render(<Heading level={level}>Título</Heading>)

      // Assert
      expect(screen.getByRole('heading', { level })).toHaveTextContent('Título')
    }
  )

  it('keeps the level when size overrides the appearance', () => {
    // Arrange / Act
    render(
      <Heading level={3} size="xl">
        Resumo do dia
      </Heading>
    )

    // Assert
    const heading = screen.getByRole('heading', { level: 3 })
    expect(heading).toHaveClass(styles.sizeExtraLarge)
  })

  it('falls back to the size that matches the level', () => {
    // Arrange / Act
    render(<Heading level={2}>Seção</Heading>)

    // Assert
    expect(screen.getByRole('heading', { level: 2 })).toHaveClass(
      styles.sizeLarge
    )
  })

  it.each(['strong', 'brand-strong', 'danger'] as const)(
    'renders color %s without breaking',
    (color) => {
      // Arrange / Act
      render(
        <Heading level={2} color={color}>
          Título
        </Heading>
      )

      // Assert
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
    }
  )

  it('merges an extra className with the generated ones', () => {
    // Arrange / Act
    render(
      <Heading level={2} className="mb-4">
        Seção
      </Heading>
    )

    // Assert
    expect(screen.getByRole('heading', { level: 2 })).toHaveClass('mb-4')
  })

  it('wraps the content in the underline only when accented', () => {
    // Arrange / Act
    render(
      <>
        <Heading level={1} accent>
          Pedidos
        </Heading>
        <Heading level={2}>Clientes</Heading>
      </>
    )

    // Assert
    expect(screen.getByText('Pedidos')).toHaveClass(styles.accent)
    expect(screen.getByText('Clientes').tagName).toBe('H2')
  })
})
