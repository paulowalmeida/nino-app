import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { OpenTabTablePicker } from './OpenTabTablePicker'
import { openTabTablePickerMock } from './OpenTabTablePicker.mock'

const renderPicker = (overrides: Record<string, unknown> = {}) => {
  const props = {
    diningTableSeats: openTabTablePickerMock.seats,
    isLoadingSeats: false,
    isOpening: false,
    onSeatSelect: vi.fn(),
    onTabReady: vi.fn(),
    selectedSeatId: null,
    ...overrides,
  }

  render(<OpenTabTablePicker {...props} />)
  return props
}

describe('OpenTabTablePicker', () => {
  beforeEach(() => vi.clearAllMocks())

  it('selects a free table without opening its tab', async () => {
    const props = renderPicker()

    await userEvent.click(
      screen.getByRole('button', { name: openTabTablePickerMock.freeSeatName })
    )

    expect(props.onSeatSelect).toHaveBeenCalledWith(
      openTabTablePickerMock.seats[1]
    )
    expect(props.onTabReady).not.toHaveBeenCalled()
  })

  it('leads an occupied table to its open tab instead of a second one', async () => {
    const props = renderPicker()

    expect(screen.getByText('Aberta')).toBeInTheDocument()
    await userEvent.click(
      screen.getByRole('button', {
        name: openTabTablePickerMock.occupiedSeatName,
      })
    )

    expect(props.onTabReady).toHaveBeenCalledWith('tab-1')
    expect(props.onSeatSelect).not.toHaveBeenCalled()
  })

  it('points to the settings when the store has no tables', () => {
    renderPicker({ diningTableSeats: [] })

    expect(screen.getByText(/Nenhuma mesa cadastrada/)).toBeInTheDocument()
    expect(screen.queryByRole('group')).not.toBeInTheDocument()
  })

  it('holds the place of the tables while they load', () => {
    renderPicker({ isLoadingSeats: true })

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.queryByText(/Nenhuma mesa/)).not.toBeInTheDocument()
  })
})
