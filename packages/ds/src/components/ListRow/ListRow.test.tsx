import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ListRow } from './ListRow'

describe(ListRow.name, () => {
  it('renders an li', () => {
    // Arrange / Act
    render(<ListRow>conteúdo</ListRow>)

    // Assert
    expect(screen.getByText('conteúdo').tagName).toBe('LI')
  })

  it('separates itself from the row above by default', () => {
    // Arrange / Act
    render(<ListRow>conteúdo</ListRow>)

    // Assert
    expect(screen.getByText('conteúdo')).toHaveClass('border-t')
  })

  it('moves the divider to the bottom when asked', () => {
    // Arrange / Act
    render(<ListRow divider="bottom">conteúdo</ListRow>)

    // Assert
    const row = screen.getByText('conteúdo')
    expect(row).toHaveClass('border-b')
    expect(row).not.toHaveClass('border-t')
  })

  it('drops the divider entirely', () => {
    // Arrange / Act
    render(<ListRow divider="none">conteúdo</ListRow>)

    // Assert
    const row = screen.getByText('conteúdo')
    expect(row).not.toHaveClass('border-t')
    expect(row).not.toHaveClass('border-b')
  })

  it.each(['start', 'center', 'end', 'baseline'] as const)(
    'aligns its content to %s',
    (align) => {
      // Arrange / Act
      render(<ListRow align={align}>conteúdo</ListRow>)

      // Assert
      expect(screen.getByText('conteúdo')).toHaveClass(`items-${align}`)
    }
  )

  it('lets the content wrap when asked', () => {
    // Arrange / Act
    render(<ListRow wrap>conteúdo</ListRow>)

    // Assert
    expect(screen.getByText('conteúdo')).toHaveClass('flex-wrap')
  })

  it('accepts a gap and a vertical padding from the scale', () => {
    // Arrange / Act
    render(
      <ListRow gap={2} padding={2.5}>
        conteúdo
      </ListRow>
    )

    // Assert
    const row = screen.getByText('conteúdo')
    expect(row).toHaveClass('gap-2')
    expect(row).toHaveClass('py-2.5')
  })

  it('applies the margin props', () => {
    // Arrange / Act
    render(<ListRow mt={4}>conteúdo</ListRow>)

    // Assert
    expect(screen.getByText('conteúdo')).toHaveClass('mt-4')
  })
})
