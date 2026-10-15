import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { ProductChoiceMultiple } from './ProductChoiceMultiple'
import {
  additionGroupMock,
  compositionGroupMock,
} from './ProductChoiceMultiple.mock'

describe('ProductChoiceMultiple', () => {
  it('prices an addition as an extra and hides free options price', () => {
    // Arrange
    render(
      <ProductChoiceMultiple
        group={additionGroupMock}
        selectedOptionIds={[]}
        isAtLimit={false}
        onToggle={vi.fn()}
      />
    )

    // Assert
    expect(screen.getByText(/^\+ R\$\s6,00$/)).toBeInTheDocument()
    expect(screen.getByText('Cebola')).toBeInTheDocument()
    expect(screen.queryByText(/0,00/)).not.toBeInTheDocument()
  })

  it('prices a composition option without the extra sign', () => {
    // Arrange
    render(
      <ProductChoiceMultiple
        group={compositionGroupMock}
        selectedOptionIds={[]}
        isAtLimit={false}
        onToggle={vi.fn()}
      />
    )

    // Assert
    expect(screen.getByText(/^R\$\s3,00$/)).toBeInTheDocument()
  })

  it('reports the toggled option', async () => {
    // Arrange
    const onToggle = vi.fn()
    render(
      <ProductChoiceMultiple
        group={additionGroupMock}
        selectedOptionIds={[]}
        isAtLimit={false}
        onToggle={onToggle}
      />
    )

    // Act
    await userEvent.click(screen.getAllByRole('checkbox')[0])

    // Assert
    expect(onToggle).toHaveBeenCalledWith('option-bacon', true)
  })

  it('locks unchosen options once the limit is reached', () => {
    // Arrange
    render(
      <ProductChoiceMultiple
        group={additionGroupMock}
        selectedOptionIds={['option-bacon']}
        isAtLimit
        onToggle={vi.fn()}
      />
    )

    // Assert
    const [bacon, onion] = screen.getAllByRole('checkbox')
    expect(bacon).toBeChecked()
    expect(bacon).toBeEnabled()
    expect(onion).toBeDisabled()
  })
})
