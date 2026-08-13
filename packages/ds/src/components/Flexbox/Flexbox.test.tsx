import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Flexbox } from './Flexbox'

describe(Flexbox.name, () => {
  it('stacks downward by default', () => {
    // Arrange / Act
    render(<Flexbox>conteúdo</Flexbox>)

    // Assert
    const stack = screen.getByText('conteúdo')
    expect(stack).toHaveClass('flex')
    expect(stack).toHaveClass('flex-col')
  })

  it('renders a div unless another tag is asked for', () => {
    // Arrange / Act
    render(<Flexbox>conteúdo</Flexbox>)

    // Assert
    expect(screen.getByText('conteúdo').tagName).toBe('DIV')
  })

  it.each(['section', 'header', 'ul', 'nav'] as const)(
    'renders tag %s when asked',
    (as) => {
      // Arrange / Act
      render(<Flexbox as={as}>conteúdo</Flexbox>)

      // Assert
      expect(screen.getByText('conteúdo').tagName).toBe(as.toUpperCase())
    }
  )

  it('lines children up side by side on direction row', () => {
    // Arrange / Act
    render(<Flexbox direction="row">conteúdo</Flexbox>)

    // Assert
    expect(screen.getByText('conteúdo')).toHaveClass('flex-row')
  })

  it('accepts a gap with a half step', () => {
    // Arrange / Act
    render(<Flexbox gap={1.5}>conteúdo</Flexbox>)

    // Assert
    expect(screen.getByText('conteúdo')).toHaveClass('gap-1.5')
  })

  it('prefixes the desktop half of a responsive gap', () => {
    // Arrange / Act
    render(<Flexbox gap={{ mobile: 3, desktop: 6 }}>conteúdo</Flexbox>)

    // Assert
    const stack = screen.getByText('conteúdo')
    expect(stack).toHaveClass('gap-3')
    expect(stack).toHaveClass('lg:gap-6')
  })

  it('changes direction between mobile and desktop', () => {
    // Arrange / Act
    render(
      <Flexbox direction={{ mobile: 'column', desktop: 'row' }}>
        conteúdo
      </Flexbox>
    )

    // Assert
    const stack = screen.getByText('conteúdo')
    expect(stack).toHaveClass('flex-col')
    expect(stack).toHaveClass('lg:flex-row')
  })

  it('changes alignment between mobile and desktop', () => {
    // Arrange / Act
    render(
      <Flexbox align={{ mobile: 'center', desktop: 'start' }}>conteúdo</Flexbox>
    )

    // Assert
    const stack = screen.getByText('conteúdo')
    expect(stack).toHaveClass('items-center')
    expect(stack).toHaveClass('lg:items-start')
  })

  it('holds its size when shrink is turned off', () => {
    // Arrange / Act
    render(<Flexbox shrink={false}>conteúdo</Flexbox>)

    // Assert
    expect(screen.getByText('conteúdo')).toHaveClass('shrink-0')
  })

  it('changes justify between mobile and desktop', () => {
    // Arrange / Act
    render(
      <Flexbox justify={{ mobile: 'start', desktop: 'center' }}>
        conteúdo
      </Flexbox>
    )

    // Assert
    const flexbox = screen.getByText('conteúdo')
    expect(flexbox).toHaveClass('justify-start')
    expect(flexbox).toHaveClass('lg:justify-center')
  })

  it('applies the margin props', () => {
    // Arrange / Act
    render(<Flexbox mb={{ mobile: 3, desktop: 6 }}>conteúdo</Flexbox>)

    // Assert
    const stack = screen.getByText('conteúdo')
    expect(stack).toHaveClass('mb-3')
    expect(stack).toHaveClass('lg:mb-6')
  })
})
