import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Text } from './Text'
import styles from './Text.module.css'

describe(Text.name, () => {
  it('renders the content in a paragraph by default', () => {
    // Arrange / Act
    render(<Text>Pedido confirmado</Text>)

    // Assert
    expect(screen.getByText('Pedido confirmado').tagName).toBe('P')
  })

  it.each(['p', 'span', 'strong', 'em'] as const)(
    'renders tag %s when asked',
    (as) => {
      // Arrange / Act
      render(<Text as={as}>Texto</Text>)

      // Assert
      expect(screen.getByText('Texto').tagName).toBe(as.toUpperCase())
    }
  )

  it.each([
    ['xs', styles.sizeExtraSmall],
    ['sm', styles.sizeSmall],
    ['base', styles.sizeBase],
    ['lg', styles.sizeLarge],
  ] as const)('renders size %s without breaking', (size, sizeClassName) => {
    // Arrange / Act
    render(<Text size={size}>Texto</Text>)

    // Assert
    expect(screen.getByText('Texto')).toHaveClass(sizeClassName)
  })

  it('pairs uppercase with the tracking that keeps it readable', () => {
    // Arrange / Act
    render(<Text case="uppercase">Observações</Text>)

    // Assert
    const text = screen.getByText('Observações')
    expect(text).toHaveClass(styles.caseUppercase)
  })

  it('leaves the text untouched when no case is given', () => {
    // Arrange / Act
    render(<Text>Observações</Text>)

    // Assert
    const text = screen.getByText('Observações')
    expect(text).not.toHaveClass(styles.caseUppercase)
    expect(text).not.toHaveClass(styles.caseLowercase)
    expect(text).not.toHaveClass(styles.caseCapitalize)
  })

  it.each(['left', 'center', 'right'] as const)(
    'renders align %s without breaking',
    (align) => {
      // Arrange / Act
      render(<Text align={align}>Texto</Text>)

      // Assert
      expect(screen.getByText('Texto')).toHaveClass(`text-${align}`)
    }
  )

  it.each(['normal', 'medium', 'semibold', 'bold', 'extrabold'] as const)(
    'renders weight %s without breaking',
    (weight) => {
      // Arrange / Act
      render(<Text weight={weight}>Texto</Text>)

      // Assert
      expect(screen.getByText('Texto')).toHaveClass(
        styles[`weight${weight[0].toUpperCase()}${weight.slice(1)}`]
      )
    }
  )

  it('inherits the surface weight when none is given', () => {
    // Arrange / Act
    render(<Text>Texto</Text>)

    // Assert
    expect(screen.getByText('Texto').className).not.toMatch(/weight/)
  })

  it('switches to the display face when asked', () => {
    // Arrange / Act
    render(<Text font="display">Texto</Text>)

    // Assert
    expect(screen.getByText('Texto')).toHaveClass(styles.fontDisplay)
  })

  it('merges an extra className with the generated ones', () => {
    // Arrange / Act
    render(<Text className="mt-2">Texto</Text>)

    // Assert
    expect(screen.getByText('Texto')).toHaveClass('mt-2')
  })
})
