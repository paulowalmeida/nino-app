import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { useCompanyGroups } from '@hooks/session/useCompanyGroups'

import { StoreSelection } from '@pages/store-selection/StoreSelection'

import { multiUnitCompany, singleUnitCompany } from './StoreSelection.mock'

const navigate = vi.hoisted(() => vi.fn())

vi.mock('react-router', () => ({ useNavigate: () => navigate }))
vi.mock('@hooks/session/useCompanyGroups')

const mockCompanyGroups = (
  groups: ReturnType<typeof useCompanyGroups> = []
) => vi.mocked(useCompanyGroups).mockReturnValue(groups)

describe(StoreSelection.name, () => {
  it('renders nothing to pick with no memberships', () => {
    // Arrange
    mockCompanyGroups([])

    // Act
    render(<StoreSelection />)

    // Assert
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('shows the tenant name for a company with a single unit', () => {
    // Arrange
    mockCompanyGroups([singleUnitCompany])

    // Act
    render(<StoreSelection />)

    // Assert
    expect(screen.getByText('Padaria Boa')).toBeInTheDocument()
    expect(screen.getByText('Loja Centro')).toBeInTheDocument()
  })

  it('shows the unit count for a company with multiple units', () => {
    // Arrange
    mockCompanyGroups([multiUnitCompany])

    // Act
    render(<StoreSelection />)

    // Assert
    expect(screen.getByText('Hamburgueria Top')).toBeInTheDocument()
    expect(screen.getByText('2 unidades')).toBeInTheDocument()
  })

  it('navigates to the current unit when a company is selected', async () => {
    // Arrange
    mockCompanyGroups([multiUnitCompany])
    render(<StoreSelection />)

    // Act
    await userEvent.click(screen.getByText('Hamburgueria Top'))

    // Assert
    expect(navigate).toHaveBeenCalledWith('/tenant-3/visao-geral')
  })

  it('falls back to the first unit when none is marked current', async () => {
    // Arrange
    const noCurrentUnit = {
      ...singleUnitCompany,
      units: singleUnitCompany.units.map((unit) => ({
        ...unit,
        isCurrent: false,
      })),
    }
    mockCompanyGroups([noCurrentUnit])
    render(<StoreSelection />)

    // Act
    await userEvent.click(screen.getByText('Padaria Boa'))

    // Assert
    expect(navigate).toHaveBeenCalledWith('/tenant-1/visao-geral')
  })
})
