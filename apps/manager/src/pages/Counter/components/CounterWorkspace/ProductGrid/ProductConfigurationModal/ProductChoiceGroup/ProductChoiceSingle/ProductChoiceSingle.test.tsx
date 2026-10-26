import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { ProductChoiceSingle } from './ProductChoiceSingle'
import {
  breadChoiceGroupMock,
  sauceChoiceGroupMock,
} from './ProductChoiceSingle.mock'

describe('ProductChoiceSingle', () => {
  it('marks the chosen option', () => {
    // Arrange
    render(
      <ProductChoiceSingle
        group={breadChoiceGroupMock}
        selectedOptionId="option-brioche"
        onSelect={vi.fn()}
      />
    )

    // Assert
    expect(screen.getByRole('radio', { name: /Brioche/ })).toBeChecked()
    expect(screen.getByRole('radio', { name: /Gergelim/ })).not.toBeChecked()
  })

  it('reports the picked option', async () => {
    // Arrange
    const onSelect = vi.fn()
    render(
      <ProductChoiceSingle
        group={breadChoiceGroupMock}
        selectedOptionId={undefined}
        onSelect={onSelect}
      />
    )

    // Act
    await userEvent.click(screen.getByRole('radio', { name: /Brioche/ }))

    // Assert
    expect(onSelect).toHaveBeenCalledWith('option-brioche')
  })

  it('prices paid options by role', () => {
    // Arrange
    const { unmount } = render(
      <ProductChoiceSingle
        group={breadChoiceGroupMock}
        selectedOptionId={undefined}
        onSelect={vi.fn()}
      />
    )

    // Assert
    expect(screen.getByText(/^R\$\s3,00$/)).toBeInTheDocument()
    expect(screen.queryByText(/0,00/)).not.toBeInTheDocument()

    // Arrange
    unmount()
    render(
      <ProductChoiceSingle
        group={sauceChoiceGroupMock}
        selectedOptionId={undefined}
        onSelect={vi.fn()}
      />
    )

    // Assert
    expect(screen.getByText(/^\+ R\$\s2,00$/)).toBeInTheDocument()
  })
})
