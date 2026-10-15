import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ProductChoiceGroup } from './ProductChoiceGroup'
import {
  optionalMultipleGroupMock,
  requiredSingleGroupMock,
} from './ProductChoiceGroup.mock'

describe('ProductChoiceGroup', () => {
  it('asks for exactly one option as radio buttons', () => {
    // Arrange
    render(
      <ProductChoiceGroup
        group={requiredSingleGroupMock}
        selectedOptionIds={[]}
        isAtLimit={false}
        onSelectSingle={vi.fn()}
        onToggleOption={vi.fn()}
      />
    )

    // Assert
    expect(
      screen.getByRole('group', { name: 'Ponto da carne' })
    ).toBeInTheDocument()
    expect(screen.getAllByRole('radio')).toHaveLength(2)
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
  })

  it('offers several options as checkboxes', () => {
    // Arrange
    render(
      <ProductChoiceGroup
        group={optionalMultipleGroupMock}
        selectedOptionIds={[]}
        isAtLimit={false}
        onSelectSingle={vi.fn()}
        onToggleOption={vi.fn()}
      />
    )

    // Assert
    expect(screen.getByRole('group', { name: 'Adicionais' })).toBeInTheDocument()
    expect(screen.getAllByRole('checkbox')).toHaveLength(2)
    expect(screen.queryByRole('radio')).not.toBeInTheDocument()
  })
})
