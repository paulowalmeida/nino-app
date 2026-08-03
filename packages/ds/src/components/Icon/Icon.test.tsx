import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Icon } from './Icon'

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

  it('hides itself from assistive tech', () => {
    // Arrange / Act
    const { container } = render(<Icon name="trash" />)

    // Assert
    expect(container.querySelector('svg')).toHaveAttribute(
      'aria-hidden',
      'true'
    )
  })

  it('applies the medium size by default', () => {
    // Arrange / Act
    const { container } = render(<Icon name="trash" />)

    // Assert
    expect(container.querySelector('svg')).toHaveClass('h-5', 'w-5')
  })

  it('applies the given size', () => {
    // Arrange / Act
    const { container } = render(<Icon name="trash" size="lg" />)

    // Assert
    expect(container.querySelector('svg')).toHaveClass('h-6', 'w-6')
  })

  it('appends the given className to its own', () => {
    // Arrange / Act
    const { container } = render(<Icon name="trash" className="extra" />)

    // Assert
    expect(container.querySelector('svg')).toHaveClass('extra')
  })
})
