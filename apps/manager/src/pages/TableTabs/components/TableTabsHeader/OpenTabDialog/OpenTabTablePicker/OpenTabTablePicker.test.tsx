import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useTableTabsFacade } from '@pages/TableTabs/facades/useTableTabsFacade/useTableTabsFacade'

import { OpenTabTablePicker } from './OpenTabTablePicker'
import { openTabTablePickerMock } from './OpenTabTablePicker.mock'

vi.mock('@pages/TableTabs/facades/useTableTabsFacade/useTableTabsFacade')

const mockFacade = (overrides: Record<string, unknown> = {}) => {
  const submitOpen = vi.fn()
  vi.mocked(useTableTabsFacade).mockReturnValue({
    diningTableSeats: openTabTablePickerMock.seats,
    isLoadingSeats: false,
    submitOpen,
    isOpening: false,
    ...overrides,
  } as unknown as ReturnType<typeof useTableTabsFacade>)
  return submitOpen
}

describe('OpenTabTablePicker', () => {
  beforeEach(() => vi.clearAllMocks())

  it('opens the tab of a free table with one tap', async () => {
    const submitOpen = mockFacade()
    submitOpen.mockImplementation(
      (_request: unknown, options: { onSuccess: (tab: unknown) => void }) =>
        options.onSuccess(openTabTablePickerMock.openedTab)
    )
    const onTabReady = vi.fn()
    render(<OpenTabTablePicker onTabReady={onTabReady} />)

    await userEvent.click(
      screen.getByRole('button', { name: openTabTablePickerMock.freeSeatName })
    )

    expect(submitOpen).toHaveBeenCalledWith(
      { diningTableId: 'table-5' },
      expect.objectContaining({ onSuccess: expect.any(Function) })
    )
    expect(onTabReady).toHaveBeenCalledWith('tab-new')
  })

  it('leads an occupied table to its open tab instead of a second one', async () => {
    const submitOpen = mockFacade()
    const onTabReady = vi.fn()
    render(<OpenTabTablePicker onTabReady={onTabReady} />)

    expect(screen.getByText('Aberta')).toBeInTheDocument()
    await userEvent.click(
      screen.getByRole('button', {
        name: openTabTablePickerMock.occupiedSeatName,
      })
    )

    expect(onTabReady).toHaveBeenCalledWith('tab-1')
    expect(submitOpen).not.toHaveBeenCalled()
  })

  it('points to the settings when the store has no tables', () => {
    mockFacade({ diningTableSeats: [] })

    render(<OpenTabTablePicker onTabReady={vi.fn()} />)

    expect(screen.getByText(/Nenhuma mesa cadastrada/)).toBeInTheDocument()
    expect(screen.queryByRole('group')).not.toBeInTheDocument()
  })

  it('holds the place of the tables while they load', () => {
    mockFacade({ isLoadingSeats: true })

    render(<OpenTabTablePicker onTabReady={vi.fn()} />)

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.queryByText(/Nenhuma mesa/)).not.toBeInTheDocument()
  })
})
