import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useOverviewFacade } from '@pages/Overview/facades/useOverviewFacade/useOverviewFacade'

import { PauseSwitch } from './PauseSwitch'
import { pauseSwitchMock } from './PauseSwitch.mock'

vi.mock('@pages/Overview/facades/useOverviewFacade/useOverviewFacade')
  vi.mock('./PauseDurationModal/PauseDurationModal', () => ({
  PauseDurationModal: ({
    open,
    onSelectDuration,
    onCancel,
    onOpenChange,
  }: {
    open: boolean
    onSelectDuration: (minutes: number) => void
    onCancel: () => void
    onOpenChange: (open: boolean) => void
  }) => (
    <div>
      <span>{String(open)}</span>
      <button onClick={() => onSelectDuration(30)}>select duration</button>
      <button onClick={onCancel}>cancel pause</button>
      <button onClick={() => onOpenChange(true)}>reopen modal</button>
      <button onClick={() => onOpenChange(false)}>close modal</button>
    </div>
  ),
}))

describe('PauseSwitch', () => {
  it('renders while pause data is loading', () => {
    vi.mocked(useOverviewFacade).mockReturnValue({
      timezone: pauseSwitchMock.timezone,
      pause: { data: undefined, isPending: true },
      pauseActions: {},
    } as never)

    render(<PauseSwitch />)

    expect(screen.queryByText('pause modal')).not.toBeInTheDocument()
  })

  it('renders no control when pause data is unavailable', () => {
    vi.mocked(useOverviewFacade).mockReturnValue({
      timezone: pauseSwitchMock.timezone,
      pause: { data: undefined, isPending: false },
      pauseActions: {},
    } as never)

    render(<PauseSwitch />)

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('allows reopening a paused store', () => {
    const mutate = vi.fn()
    vi.mocked(useOverviewFacade).mockReturnValue({
      timezone: pauseSwitchMock.timezone,
      pause: {
        data: { isPaused: true, pausedUntil: null, pauseReason: null },
        isPending: false,
      },
      pauseActions: { resume: { mutate, isPending: false } },
    } as never)

    render(<PauseSwitch />)
    screen.getByRole('button', { name: 'Reabrir agora' }).click()

    expect(mutate).toHaveBeenCalled()
  })

  it('renders a scheduled pause and reopens through the modal callback', () => {
    const mutate = vi.fn()
    vi.mocked(useOverviewFacade).mockReturnValue({
      timezone: null,
      pause: {
        data: { isPaused: true, pausedUntil: Date.now(), pauseReason: 'Intervalo' },
        isPending: false,
      },
      pauseActions: { resume: { mutate, isPending: true } },
    } as never)

    render(<PauseSwitch />)

    expect(screen.getByText(/Fechada até/)).toBeInTheDocument()
    expect(screen.getByText('Intervalo')).toBeInTheDocument()
    expect(mutate).not.toHaveBeenCalled()
  })

  it('opens the pause modal and submits a duration', () => {
    const mutate = vi.fn()
    vi.mocked(useOverviewFacade).mockReturnValue({
      timezone: pauseSwitchMock.timezone,
      pause: {
        data: { isPaused: false, pausedUntil: null, pauseReason: null },
        isPending: false,
      },
      pauseActions: {
        pause: { mutate, isPending: false, variables: undefined },
        resume: { mutate: vi.fn(), isPending: false },
      },
    } as never)

    render(<PauseSwitch />)
    screen.getByRole('button', { name: /Fechar a loja/ }).click()
    screen.getByRole('button', { name: 'reopen modal' }).click()
    screen.getByRole('button', { name: 'close modal' }).click()
    screen.getByRole('button', { name: 'select duration' }).click()
    screen.getByRole('button', { name: 'cancel pause' }).click()

    expect(mutate).toHaveBeenCalledWith({ minutes: 30, reason: undefined })
  })
})
