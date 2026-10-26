import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ChoiceCard } from './ChoiceCard'
import { choiceCardMock, choiceCardSelectedMock } from './ChoiceCard.mock'

describe(ChoiceCard.name, () => {
  it('announces the selected choice and reports the pick', () => {
    // Arrange
    const onSelect = vi.fn()
    render(<ChoiceCard {...choiceCardSelectedMock} onSelect={onSelect} />)
    const choice = screen.getByRole('button', { name: /Entrega/ })

    // Act
    fireEvent.click(choice)

    // Assert
    expect(choice).toHaveAttribute('aria-pressed', 'true')
    expect(onSelect).toHaveBeenCalledTimes(1)
  })

  it('renders without a hint', () => {
    // Arrange
    const { icon, label, isSelected } = choiceCardMock

    // Act
    render(
      <ChoiceCard
        icon={icon}
        label={label}
        isSelected={isSelected}
        onSelect={vi.fn()}
      />
    )

    // Assert
    expect(
      screen.queryByText('Cliente recebe no endereço')
    ).not.toBeInTheDocument()
  })
})
