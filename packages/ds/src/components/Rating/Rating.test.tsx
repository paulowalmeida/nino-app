import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Rating } from './Rating'

describe(Rating.name, () => {
  it('renders the correct number of stars', () => {
    render(<Rating count={5} />)
    expect(screen.getAllByRole('radio')).toHaveLength(5)
  })

  it('reflects the default value', () => {
    render(<Rating defaultValue={3} />)
    const stars = screen.getAllByRole('radio')
    expect(stars[2]).toHaveAttribute('data-checked', '')
  })

  it('calls onValueChange when a star is clicked', async () => {
    const onValueChange = vi.fn()
    render(<Rating onValueChange={onValueChange} />)
    await userEvent.click(screen.getAllByRole('radio')[3])
    expect(onValueChange).toHaveBeenCalledWith(4)
  })

  it('does not call onValueChange when readOnly', async () => {
    const onValueChange = vi.fn()
    render(<Rating readOnly defaultValue={3} onValueChange={onValueChange} />)
    await userEvent.click(screen.getAllByRole('radio')[0])
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('renders a custom count', () => {
    render(<Rating count={3} />)
    expect(screen.getAllByRole('radio')).toHaveLength(3)
  })
})
