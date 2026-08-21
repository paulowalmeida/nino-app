import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Box } from './Box'

describe(Box.name, () => {
  it('stacks downward by default', () => {
    // Arrange / Act
    render(<Box>conteúdo</Box>)

    // Assert
    const stack = screen.getByText('conteúdo')
    expect(stack).toHaveClass('flex')
    expect(stack).toHaveClass('flex-col')
  })

  it('renders a div unless another tag is asked for', () => {
    // Arrange / Act
    render(<Box>conteúdo</Box>)

    // Assert
    expect(screen.getByText('conteúdo').tagName).toBe('DIV')
  })

  it.each(['section', 'header', 'ul', 'nav'] as const)(
    'renders tag %s when asked',
    (as) => {
      // Arrange / Act
      render(<Box as={as}>conteúdo</Box>)

      // Assert
      expect(screen.getByText('conteúdo').tagName).toBe(as.toUpperCase())
    }
  )

  it('lines children up side by side on direction row', () => {
    // Arrange / Act
    render(<Box direction="row">conteúdo</Box>)

    // Assert
    expect(screen.getByText('conteúdo')).toHaveClass('flex-row')
  })

  it('accepts a gap with a half step', () => {
    // Arrange / Act
    render(<Box gap={1.5}>conteúdo</Box>)

    // Assert
    expect(screen.getByText('conteúdo')).toHaveClass('gap-1.5')
  })

  it('prefixes the desktop half of a responsive gap', () => {
    // Arrange / Act
    render(<Box gap={{ mobile: 3, desktop: 6 }}>conteúdo</Box>)

    // Assert
    const stack = screen.getByText('conteúdo')
    expect(stack).toHaveClass('gap-3')
    expect(stack).toHaveClass('lg:gap-6')
  })

  it('changes direction between mobile and desktop', () => {
    // Arrange / Act
    render(
      <Box direction={{ mobile: 'column', desktop: 'row' }}>
        conteúdo
      </Box>
    )

    // Assert
    const stack = screen.getByText('conteúdo')
    expect(stack).toHaveClass('flex-col')
    expect(stack).toHaveClass('lg:flex-row')
  })

  it('changes alignment between mobile and desktop', () => {
    // Arrange / Act
    render(
      <Box align={{ mobile: 'center', desktop: 'start' }}>conteúdo</Box>
    )

    // Assert
    const stack = screen.getByText('conteúdo')
    expect(stack).toHaveClass('items-center')
    expect(stack).toHaveClass('lg:items-start')
  })

  it('holds its size when shrink is turned off', () => {
    // Arrange / Act
    render(<Box shrink={false}>conteúdo</Box>)

    // Assert
    expect(screen.getByText('conteúdo')).toHaveClass('shrink-0')
  })

  it('changes justify between mobile and desktop', () => {
    // Arrange / Act
    render(
      <Box justify={{ mobile: 'start', desktop: 'center' }}>
        conteúdo
      </Box>
    )

    // Assert
    const Box = screen.getByText('conteúdo')
    expect(Box).toHaveClass('justify-start')
    expect(Box).toHaveClass('lg:justify-center')
  })

  it('applies the margin props', () => {
    // Arrange / Act
    render(<Box mb={{ mobile: 3, desktop: 6 }}>conteúdo</Box>)

    // Assert
    const stack = screen.getByText('conteúdo')
    expect(stack).toHaveClass('mb-3')
    expect(stack).toHaveClass('lg:mb-6')
  })
})
