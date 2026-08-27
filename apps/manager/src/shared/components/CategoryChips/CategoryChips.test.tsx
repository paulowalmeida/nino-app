import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { CategoryChips } from './CategoryChips'
import { categoryChipsMock } from './CategoryChips.mock'

describe(CategoryChips.name, () => {
  it('renders categories and selects one', () => {
    const onChange = vi.fn()
    render(<CategoryChips {...categoryChipsMock} value={null} onChange={onChange} />)
    fireEvent.click(screen.getByRole('tab', { name: 'Bebidas' }))
    expect(onChange).toHaveBeenCalledWith('drinks')
  })

  it('renders loading placeholders and all option', () => {
    const { container, rerender } = render(<CategoryChips categories={[]} value={null} onChange={vi.fn()} isPending />)
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument()
    rerender(<CategoryChips {...categoryChipsMock} value={null} onChange={vi.fn()} />)
    fireEvent.click(screen.getByRole('tab', { name: 'Todas' }))
    expect(screen.getByRole('tab', { name: 'Todas' })).toBeInTheDocument()
    rerender(<CategoryChips {...categoryChipsMock} value="drinks" onChange={vi.fn()} allowAll={false} />)
    expect(screen.queryByRole('tab', { name: 'Todas' })).not.toBeInTheDocument()
  })
})
