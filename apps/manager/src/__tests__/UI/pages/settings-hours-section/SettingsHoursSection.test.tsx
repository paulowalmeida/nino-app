import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { useOpeningHours } from '@hooks/settings/useOpeningHours'
import { useSaveWeek } from '@hooks/settings/useSaveWeek'

import {
  SettingsHoursSection,
} from '@pages/settings-hours-section/SettingsHoursSection'

import { currentTenant, sundayHours } from './SettingsHoursSection.mock'

vi.mock('@hooks/session/useCurrentTenant')
vi.mock('@hooks/settings/useOpeningHours')
vi.mock('@hooks/settings/useSaveWeek')

describe(SettingsHoursSection.name, () => {
  it('shows every weekday with the saved schedule', () => {
    // Arrange
    vi.mocked(useCurrentTenant).mockReturnValue(currentTenant)
    vi.mocked(useOpeningHours).mockReturnValue({
      hours: [sundayHours],
      isPending: false,
    } as unknown as ReturnType<typeof useOpeningHours>)
    vi.mocked(useSaveWeek).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    } as unknown as ReturnType<typeof useSaveWeek>)

    // Act
    render(<SettingsHoursSection />)

    // Assert
    expect(screen.getByText('Domingo')).toBeInTheDocument()
    expect(screen.getByText('Sábado')).toBeInTheDocument()
  })

  it('shows a skeleton while the hours are loading', () => {
    // Arrange
    vi.mocked(useCurrentTenant).mockReturnValue(currentTenant)
    vi.mocked(useOpeningHours).mockReturnValue({
      hours: [],
      isPending: true,
    } as unknown as ReturnType<typeof useOpeningHours>)
    vi.mocked(useSaveWeek).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    } as unknown as ReturnType<typeof useSaveWeek>)

    // Act
    const { container } = render(<SettingsHoursSection />)

    // Assert
    expect(container.querySelector('[aria-hidden="true"]'))
      .toBeInTheDocument()
  })
})
