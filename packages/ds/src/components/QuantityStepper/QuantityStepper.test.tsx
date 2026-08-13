import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { QuantityStepper } from './QuantityStepper'

const labels = {
  incrementLabel: 'Aumentar quantidade',
  decrementLabel: 'Diminuir quantidade',
}

describe(QuantityStepper.name, () => {
  it('renders the plain quantity when no count node is given', () => {
    // Arrange / Act
    render(
      <QuantityStepper
        quantity={3}
        onIncrement={vi.fn()}
        onDecrement={vi.fn()}
        {...labels}
      />
    )

    // Assert
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('renders the count node in place of the plain quantity', () => {
    // Arrange / Act
    render(
      <QuantityStepper
        quantity={3}
        count={<span>três</span>}
        onIncrement={vi.fn()}
        onDecrement={vi.fn()}
        {...labels}
      />
    )

    // Assert
    expect(screen.getByText('três')).toBeInTheDocument()
    expect(screen.queryByText('3')).not.toBeInTheDocument()
  })

  it('calls onIncrement and onDecrement from their own buttons', async () => {
    // Arrange
    const user = userEvent.setup()
    const onIncrement = vi.fn()
    const onDecrement = vi.fn()
    render(
      <QuantityStepper
        quantity={2}
        onIncrement={onIncrement}
        onDecrement={onDecrement}
        {...labels}
      />
    )

    // Act
    await user.click(
      screen.getByRole('button', { name: labels.incrementLabel })
    )
    await user.click(
      screen.getByRole('button', { name: labels.decrementLabel })
    )

    // Assert
    expect(onIncrement).toHaveBeenCalledTimes(1)
    expect(onDecrement).toHaveBeenCalledTimes(1)
  })

  it('blocks the decrement button when the quantity is at its floor', async () => {
    // Arrange
    const user = userEvent.setup()
    const onDecrement = vi.fn()
    render(
      <QuantityStepper
        quantity={1}
        isDecrementDisabled
        onIncrement={vi.fn()}
        onDecrement={onDecrement}
        {...labels}
      />
    )

    // Act
    await user.click(
      screen.getByRole('button', { name: labels.decrementLabel })
    )

    // Assert
    expect(onDecrement).not.toHaveBeenCalled()
  })
})
