import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { CategoryChips } from '@compositions/CategoryChips/CategoryChips'

import { twoCategories } from './CategoryChips.mock'

describe(CategoryChips.name, () => {
  it('renders one chip per category plus the all-categories chip', () => {
    // Arrange / Act
    render(
      <CategoryChips
        categories={twoCategories}
        value={null}
        onChange={vi.fn()}
      />
    )

    // Assert
    expect(screen.getAllByRole('tab')).toHaveLength(3)
  })

  it('marks the all-categories chip as selected when value is null', () => {
    // Arrange / Act
    render(
      <CategoryChips
        categories={twoCategories}
        value={null}
        onChange={vi.fn()}
      />
    )

    // Assert
    expect(screen.getByRole('tab', { name: 'Todas' })).toHaveAttribute(
      'aria-selected',
      'true'
    )
  })

  it('calls onChange with the clicked category id', async () => {
    // Arrange
    const onChange = vi.fn()
    render(
      <CategoryChips
        categories={twoCategories}
        value={null}
        onChange={onChange}
      />
    )

    // Act
    await userEvent.click(screen.getByRole('tab', { name: 'Bebidas' }))

    // Assert
    expect(onChange).toHaveBeenCalledWith('cat-2')
  })

  it('shows ghost chips instead of categories while pending', () => {
    // Arrange / Act
    render(
      <CategoryChips
        categories={twoCategories}
        value={null}
        onChange={vi.fn()}
        isPending
      />
    )

    // Assert
    expect(screen.queryByRole('tab')).not.toBeInTheDocument()
  })

  it('renders only the all-categories chip with no categories', () => {
    // Arrange / Act
    render(<CategoryChips categories={[]} value={null} onChange={vi.fn()} />)

    // Assert
    expect(screen.getAllByRole('tab')).toHaveLength(1)
  })
})
