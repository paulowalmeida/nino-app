import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { usePause } from '@hooks/store/usePause'
import { usePauseActions } from '@hooks/store/usePauseActions'
import { PauseSwitch } from '@organisms/PauseSwitch/PauseSwitch'

import {
  openPause,
  pausedIndefinitely,
  pausedWithReason,
} from './PauseSwitch.mock'

vi.mock('@hooks/store/usePause')
vi.mock('@hooks/store/usePauseActions')

const pauseMutation = {
  mutate: vi.fn(),
  isPending: false,
  variables: undefined,
}
const resumeMutation = { mutate: vi.fn(), isPending: false }

const mockPause = (
  data: ReturnType<typeof usePause>['data'],
  isPending = false
) =>
  vi.mocked(usePause).mockReturnValue({
    data,
    isPending,
  } as unknown as ReturnType<typeof usePause>)

const mockPauseActions = () =>
  vi.mocked(usePauseActions).mockReturnValue({
    pause: pauseMutation,
    resume: resumeMutation,
  } as unknown as ReturnType<typeof usePauseActions>)

describe(PauseSwitch.name, () => {
  it('shows a skeleton while the pause state is loading', () => {
    // Arrange
    mockPause(undefined, true)
    mockPauseActions()

    // Act
    const { container } = render(
      <PauseSwitch tenantId="tenant-1" timezone="America/Sao_Paulo" />
    )

    // Assert
    expect(container.querySelector('[aria-hidden="true"]'))
      .toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Fechar a loja por um tempo' })
    ).not.toBeInTheDocument()
  })

  it('renders nothing when there is no pause data', () => {
    // Arrange
    mockPause(undefined, false)
    mockPauseActions()

    // Act
    const { container } = render(
      <PauseSwitch tenantId="tenant-1" timezone="America/Sao_Paulo" />
    )

    // Assert
    expect(container).toBeEmptyDOMElement()
  })

  it('offers the closing options when the store is open', () => {
    // Arrange
    mockPause(openPause)
    mockPauseActions()

    // Act
    render(<PauseSwitch tenantId="tenant-1" timezone="America/Sao_Paulo" />)

    // Assert
    expect(
      screen.getByRole('button', { name: 'Fechar a loja por um tempo' })
    ).toBeInTheDocument()
  })

  it('sends the chosen duration and reason when pausing', async () => {
    // Arrange
    mockPause(openPause)
    mockPauseActions()
    render(<PauseSwitch tenantId="tenant-1" timezone="America/Sao_Paulo" />)
    await userEvent.click(
      screen.getByRole('button', { name: 'Fechar a loja por um tempo' })
    )
    await userEvent.type(
      screen.getByPlaceholderText('Chuva forte, sem entregador...'),
      'Chuva forte'
    )

    // Act
    await userEvent.click(screen.getByRole('button', { name: /^30 min/ }))

    // Assert
    expect(pauseMutation.mutate).toHaveBeenCalledWith({
      minutes: 30,
      reason: 'Chuva forte',
    })
  })

  it('shows the reopen time when paused with a known end', () => {
    // Arrange
    mockPause(pausedWithReason)
    mockPauseActions()

    // Act
    render(<PauseSwitch tenantId="tenant-1" timezone="America/Sao_Paulo" />)

    // Assert
    expect(screen.getByText('Chuva forte')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reabrir agora' }))
      .toBeInTheDocument()
  })

  it('resumes the store when reopening with no scheduled end', async () => {
    // Arrange
    mockPause(pausedIndefinitely)
    mockPauseActions()
    render(<PauseSwitch tenantId="tenant-1" timezone="America/Sao_Paulo" />)

    // Act
    await userEvent.click(screen.getByRole('button', { name: 'Reabrir agora' }))

    // Assert
    expect(resumeMutation.mutate).toHaveBeenCalled()
  })
})
