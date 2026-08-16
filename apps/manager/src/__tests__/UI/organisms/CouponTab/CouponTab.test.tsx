import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { CouponTab } from '@organisms/CouponTab/CouponTab'

describe(CouponTab.name, () => {
  it('shows the singular item label when count is one', () => {
    // Arrange / Act
    render(<CouponTab count={1} total={1000} onOpen={vi.fn()} />)

    // Assert
    expect(screen.getByText('1 item')).toBeInTheDocument()
  })

  it('shows the plural item label when count is not one', () => {
    // Arrange / Act
    render(<CouponTab count={0} total={0} onOpen={vi.fn()} />)

    // Assert
    expect(screen.getByText('0 itens')).toBeInTheDocument()
  })

  it('formats the total as Brazilian currency', () => {
    // Arrange / Act
    render(<CouponTab count={2} total={15.5} onOpen={vi.fn()} />)

    // Assert
    expect(screen.getByText('R$ 15,50')).toBeInTheDocument()
  })

  it('calls onOpen when the tab is clicked', async () => {
    // Arrange
    const onOpen = vi.fn()
    render(<CouponTab count={2} total={15.5} onOpen={onOpen} />)

    // Act
    await userEvent.click(screen.getByRole('button'))

    // Assert
    expect(onOpen).toHaveBeenCalledOnce()
  })
})
