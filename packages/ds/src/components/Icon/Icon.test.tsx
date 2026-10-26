import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Icon } from './Icon'
import styles from './Icon.module.css'

const useIn = (container: HTMLElement) => container.querySelector('use')

describe(Icon.name, () => {
  it('points to the given name inside the sprite', () => {
    // Arrange / Act
    const { container } = render(<Icon name="trash" />)

    // Assert
    expect(useIn(container)?.getAttribute('href')).toMatch(/#trash$/)
  })

  it('points to a different symbol for a different name', () => {
    // Arrange
    const { container: trashContainer } = render(<Icon name="trash" />)
    const { container: gridContainer } = render(<Icon name="grid" />)

    // Act
    const trashHref = useIn(trashContainer)?.getAttribute('href')
    const gridHref = useIn(gridContainer)?.getAttribute('href')

    // Assert
    expect(trashHref).not.toEqual(gridHref)
  })

  it('resolves every name against the same sprite file', () => {
    // Arrange
    const { container: trashContainer } = render(<Icon name="trash" />)
    const { container: gridContainer } = render(<Icon name="grid" />)

    // Act
    const spriteOf = (container: HTMLElement) =>
      useIn(container)?.getAttribute('href')?.split('#')[0]

    // Assert
    expect(spriteOf(trashContainer)).toEqual(spriteOf(gridContainer))
  })

  it('stays silent for assistive tech when it is decoration', () => {
    // Arrange / Act
    const { container } = render(<Icon name="trash" />)

    // Assert
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(svg).not.toHaveAttribute('role')
  })

  it('announces itself once it is given a label', () => {
    // Arrange / Act
    const { container } = render(<Icon name="trash" label="Excluir item" />)

    // Assert
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('role', 'img')
    expect(svg).toHaveAttribute('aria-label', 'Excluir item')
    expect(svg).not.toHaveAttribute('aria-hidden')
  })

  it('paints itself with a colour token when asked', () => {
    // Arrange / Act
    const { container } = render(<Icon name="trash" color="danger" />)

    // Assert
    expect(container.querySelector('svg')).toHaveClass('text-danger')
  })

  it('applies the medium size by default', () => {
    // Arrange / Act
    const { container } = render(<Icon name="trash" />)

    // Assert
    expect(container.querySelector('svg')).toHaveClass(styles.sizeMedium)
  })

  it('applies the given size', () => {
    // Arrange / Act
    const { container } = render(<Icon name="trash" size="lg" />)

    // Assert
    expect(container.querySelector('svg')).toHaveClass(styles.sizeLarge)
  })

  it.each([
    ['xs', styles.sizeExtraSmall],
    ['sm', styles.sizeSmall],
    ['md', styles.sizeMedium],
    ['lg', styles.sizeLarge],
    ['xl', styles.sizeExtraLarge],
  ] as const)('renders size %s without breaking', (size, sizeClassName) => {
    // Arrange / Act
    const { container } = render(<Icon name="trash" size={size} />)

    // Assert
    expect(container.querySelector('svg')).toHaveClass(sizeClassName)
  })

  it('appends the given className to its own', () => {
    // Arrange / Act
    const { container } = render(<Icon name="trash" className="extra" />)

    // Assert
    expect(container.querySelector('svg')).toHaveClass('extra')
  })
})
