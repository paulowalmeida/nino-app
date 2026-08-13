import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { CompanyPickCard } from '@components/CompanyPickCard/CompanyPickCard'

import { multipleUnits, singleUnit } from './CompanyPickCard.mock'

describe(CompanyPickCard.name, () => {
  it('shows the unit name for a company with a single unit', () => {
    // Arrange / Act
    render(
      <CompanyPickCard
        companyName="Padaria Boa"
        units={singleUnit}
        index={0}
        onClick={vi.fn()}
      />
    )

    // Assert
    expect(screen.getByText('Padaria Boa')).toBeInTheDocument()
    expect(screen.getByText('Loja Centro')).toBeInTheDocument()
  })

  it('shows the unit count for a company with multiple units', () => {
    // Arrange / Act
    render(
      <CompanyPickCard
        companyName="Hamburgueria Top"
        units={multipleUnits}
        index={0}
        onClick={vi.fn()}
      />
    )

    // Assert
    expect(screen.getByText('2 unidades')).toBeInTheDocument()
  })

  it('calls onClick when picked', async () => {
    // Arrange
    const onClick = vi.fn()
    render(
      <CompanyPickCard
        companyName="Padaria Boa"
        units={singleUnit}
        index={0}
        onClick={onClick}
      />
    )

    // Act
    await userEvent.click(screen.getByText('Padaria Boa'))

    // Assert
    expect(onClick).toHaveBeenCalled()
  })
})
