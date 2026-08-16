import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { StageTrack } from '@organisms/StageTrack/StageTrack'
import type { StageOption } from '@custom_types/order/stage-option'

const stages: StageOption[] = [
  { id: 'incoming', label: 'Recebidos', count: 3, icon: 'inbox' },
  { id: 'kitchen', label: 'Em preparo', count: 1, icon: 'clock' },
  { id: 'street', label: 'Em entrega', count: 0, icon: 'check' },
]

describe(StageTrack.name, () => {
  it('marks the current stage as selected', () => {
    // Arrange / Act
    render(<StageTrack stages={stages} value="kitchen" onChange={vi.fn()} />)

    // Assert
    expect(
      screen.getByRole('tab', { name: /Em preparo/ })
    ).toHaveAttribute('aria-selected', 'true')
    expect(
      screen.getByRole('tab', { name: /Recebidos/ })
    ).toHaveAttribute('aria-selected', 'false')
  })

  it('calls onChange with the clicked stage id', async () => {
    // Arrange
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<StageTrack stages={stages} value="incoming" onChange={onChange} />)

    // Act
    await user.click(screen.getByRole('tab', { name: /Em entrega/ }))

    // Assert
    expect(onChange).toHaveBeenCalledWith('street')
  })

  it('renders no tabs when the stage list is empty', () => {
    // Arrange / Act
    render(<StageTrack stages={[]} value="incoming" onChange={vi.fn()} />)

    // Assert
    expect(screen.queryAllByRole('tab')).toHaveLength(0)
  })
})
