import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useCompany } from '@hooks/company/useCompany'
import { useSaveCompany } from '@hooks/company/useSaveCompany'

import {
  SettingsCompanySection,
} from '@pages/settings-company-section/SettingsCompanySection'

import { activeCompany } from './SettingsCompanySection.mock'

vi.mock('@hooks/company/useCompany')
vi.mock('@hooks/company/useSaveCompany')

describe(SettingsCompanySection.name, () => {
  it('shows the company data once loaded', () => {
    // Arrange
    vi.mocked(useCompany).mockReturnValue({
      data: activeCompany,
      isPending: false,
    } as unknown as ReturnType<typeof useCompany>)
    vi.mocked(useSaveCompany).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as unknown as ReturnType<typeof useSaveCompany>)

    // Act
    render(<SettingsCompanySection />)

    // Assert
    expect(screen.getByDisplayValue('Lanchonete do Zé')).toBeInTheDocument()
  })

  it('shows a skeleton while the company is loading', () => {
    // Arrange
    vi.mocked(useCompany).mockReturnValue({
      data: undefined,
      isPending: true,
    } as unknown as ReturnType<typeof useCompany>)
    vi.mocked(useSaveCompany).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as unknown as ReturnType<typeof useSaveCompany>)

    // Act
    const { container } = render(<SettingsCompanySection />)

    // Assert
    expect(container.querySelector('[aria-hidden="true"]'))
      .toBeInTheDocument()
  })
})
