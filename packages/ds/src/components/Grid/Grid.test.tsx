import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Grid } from './Grid'

describe(Grid.name, () => {
  it('lays its children out in a grid', () => {
    // Arrange / Act
    render(<Grid>conteúdo</Grid>)

    // Assert
    expect(screen.getByText('conteúdo')).toHaveClass('grid')
  })

  it('renders a div unless another tag is asked for', () => {
    // Arrange / Act
    render(<Grid>conteúdo</Grid>)

    // Assert
    expect(screen.getByText('conteúdo').tagName).toBe('DIV')
  })

  it.each(['section', 'ul', 'ol', 'li'] as const)(
    'renders tag %s when asked',
    (as) => {
      // Arrange / Act
      render(<Grid as={as}>conteúdo</Grid>)

      // Assert
      expect(screen.getByText('conteúdo').tagName).toBe(as.toUpperCase())
    }
  )

  it('starts in a single column', () => {
    // Arrange / Act
    render(<Grid>conteúdo</Grid>)

    // Assert
    expect(screen.getByText('conteúdo')).toHaveClass('grid-cols-1')
  })

  it('opens more columns only from the desktop up', () => {
    // Arrange / Act
    render(<Grid columns={{ mobile: 1, desktop: 3 }}>conteúdo</Grid>)

    // Assert
    const grid = screen.getByText('conteúdo')
    expect(grid).toHaveClass('grid-cols-1')
    expect(grid).toHaveClass('lg:grid-cols-3')
  })

  it('accepts a gap with a half step', () => {
    // Arrange / Act
    render(<Grid gap={1.5}>conteúdo</Grid>)

    // Assert
    expect(screen.getByText('conteúdo')).toHaveClass('gap-1.5')
  })

  it('changes the gap between mobile and desktop', () => {
    // Arrange / Act
    render(<Grid gap={{ mobile: 2, desktop: 6 }}>conteúdo</Grid>)

    // Assert
    const grid = screen.getByText('conteúdo')
    expect(grid).toHaveClass('gap-2')
    expect(grid).toHaveClass('lg:gap-6')
  })

  it('applies the margin props', () => {
    // Arrange / Act
    render(<Grid mb={{ mobile: 3, desktop: 6 }}>conteúdo</Grid>)

    // Assert
    const grid = screen.getByText('conteúdo')
    expect(grid).toHaveClass('mb-3')
    expect(grid).toHaveClass('lg:mb-6')
  })

  it('keeps an extra className alongside the generated ones', () => {
    // Arrange / Act
    render(<Grid className="lg:grid-cols-[20rem_1fr]">conteúdo</Grid>)

    // Assert
    expect(screen.getByText('conteúdo')).toHaveClass('lg:grid-cols-[20rem_1fr]')
  })
})
