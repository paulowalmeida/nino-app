import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useOpeningHours } from '@hooks/settings/useOpeningHours'
import { usePause } from '@hooks/store/usePause'
import { StoreSign } from '@compositions/StoreSign/StoreSign'

import { notPaused, openAllDay, paused } from './StoreSign.mock'

vi.mock('@hooks/settings/useOpeningHours')
vi.mock('@hooks/store/usePause')

const mockHours = (
  overrides: Partial<ReturnType<typeof useOpeningHours>> = {}
) =>
  vi.mocked(useOpeningHours).mockReturnValue({
    hours: [openAllDay],
    isPending: false,
    isError: false,
    ...overrides,
  } as unknown as ReturnType<typeof useOpeningHours>)

const mockPause = (data = notPaused) =>
  vi.mocked(usePause).mockReturnValue({
    data,
  } as unknown as ReturnType<typeof usePause>)

describe(StoreSign.name, () => {
  it('shows a skeleton while the schedule is loading', () => {
    // Arrange
    mockHours({ isPending: true, hours: [] })
    mockPause(notPaused)

    // Act
    const { container } = render(
      <StoreSign tenantId="tenant-1" timezone="America/Sao_Paulo" />
    )

    // Assert
    expect(screen.queryByText('Aberta agora')).not.toBeInTheDocument()
    expect(container.firstChild).not.toBeNull()
  })

  it('shows the store as open when in hours and not paused', () => {
    // Arrange
    mockHours()
    mockPause(notPaused)

    // Act
    render(<StoreSign tenantId="tenant-1" timezone="America/Sao_Paulo" />)

    // Assert
    expect(screen.getByText('Aberta agora')).toBeInTheDocument()
  })

  it('shows the store as closed when manually paused', () => {
    // Arrange
    mockHours()
    mockPause(paused)

    // Act
    render(<StoreSign tenantId="tenant-1" timezone="America/Sao_Paulo" />)

    // Assert
    expect(screen.getByText('Fechada agora')).toBeInTheDocument()
  })

  it('renders nothing when the schedule fails to load', () => {
    // Arrange
    mockHours({ isError: true, hours: [] })
    mockPause(notPaused)

    // Act
    const { container } = render(
      <StoreSign tenantId="tenant-1" timezone="America/Sao_Paulo" />
    )

    // Assert
    expect(container).toBeEmptyDOMElement()
  })

  it('renders nothing when there is no schedule at all', () => {
    // Arrange
    mockHours({ hours: [] })
    mockPause(notPaused)

    // Act
    const { container } = render(
      <StoreSign tenantId="tenant-1" timezone="America/Sao_Paulo" />
    )

    // Assert
    expect(container).toBeEmptyDOMElement()
  })
})
