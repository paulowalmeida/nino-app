import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Pagination } from './Pagination'

describe(Pagination.name, () => {
  it('renders pages (first and last)', () => {
    render(<Pagination count={50} pageSize={10} />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('calls onPageChange when clicking a page', async () => {
    const onPageChange = vi.fn()
    render(<Pagination count={50} pageSize={10} onPageChange={onPageChange} />)
    await userEvent.click(screen.getByText('2'))
    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('advances with the next page button', async () => {
    const onPageChange = vi.fn()
    render(<Pagination count={50} pageSize={10} onPageChange={onPageChange} />)
    await userEvent.click(
      screen.getByRole('button', { name: 'Próxima página' })
    )
    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('marks the current page as selected', () => {
    render(<Pagination count={50} pageSize={10} page={3} />)
    expect(screen.getByText('3')).toHaveAttribute('data-selected')
  })
})
