import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ProductChoiceHeader } from './ProductChoiceHeader'
import {
  optionalRangeGroupMock,
  pluralExactGroupMock,
  requiredRangeGroupMock,
  singleExactGroupMock,
} from './ProductChoiceHeader.mock'

describe('ProductChoiceHeader', () => {
  it.each([
    [singleExactGroupMock, 'Escolha 1 opção'],
    [pluralExactGroupMock, 'Escolha 2 opções'],
    [requiredRangeGroupMock, 'Escolha de 1 até 3 opções'],
    [optionalRangeGroupMock, 'Escolha até 3 opções'],
  ])('explains the selection rule as "%#"', (group, ruleLabel) => {
    // Arrange
    render(<ProductChoiceHeader group={group} selectedCount={0} />)

    // Assert
    expect(screen.getByRole('heading', { name: 'Molhos' })).toBeInTheDocument()
    expect(screen.getByText(ruleLabel)).toBeInTheDocument()
  })

  it('flags the group as required until the minimum is chosen', () => {
    // Arrange
    render(
      <ProductChoiceHeader group={requiredRangeGroupMock} selectedCount={0} />
    )

    // Assert
    expect(screen.getByText('Obrigatório')).toBeInTheDocument()
    expect(screen.queryByText('0/3')).not.toBeInTheDocument()
  })

  it('shows the tally once the minimum is met', () => {
    // Arrange
    render(
      <ProductChoiceHeader group={requiredRangeGroupMock} selectedCount={1} />
    )

    // Assert
    expect(screen.getByText('1/3')).toBeInTheDocument()
    expect(screen.queryByText('Obrigatório')).not.toBeInTheDocument()
  })
})
