import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { CompanyCard } from '@organisms/CompanyCard/CompanyCard'

import { activeCompany } from './CompanyCard.mock'

const saveButton = () => screen.getByRole('button', { name: 'Salvar empresa' })

describe(CompanyCard.name, () => {
  it('fills the fields from the loaded company', () => {
    // Arrange / Act
    render(
      <CompanyCard
        company={activeCompany}
        isPending={false}
        isSaving={false}
        onSave={vi.fn()}
      />
    )

    // Assert
    expect(screen.getByDisplayValue(activeCompany.name)).toBeInTheDocument()
  })

  it('shows a skeleton instead of the form while pending', () => {
    // Arrange / Act
    render(
      <CompanyCard
        company={undefined}
        isPending
        isSaving={false}
        onSave={vi.fn()}
      />
    )

    // Assert
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('keeps saving disabled until a field changes', async () => {
    // Arrange
    render(
      <CompanyCard
        company={activeCompany}
        isPending={false}
        isSaving={false}
        onSave={vi.fn()}
      />
    )

    // Assert
    expect(saveButton()).toBeDisabled()

    // Act
    await userEvent.type(screen.getByDisplayValue(activeCompany.name), '!')

    // Assert
    expect(saveButton()).toBeEnabled()
  })

  it('sends the edited draft when saving', async () => {
    // Arrange
    const onSave = vi.fn()
    render(
      <CompanyCard
        company={activeCompany}
        isPending={false}
        isSaving={false}
        onSave={onSave}
      />
    )

    // Act
    await userEvent.type(screen.getByDisplayValue(activeCompany.name), '!')
    await userEvent.click(saveButton())

    // Assert
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ name: `${activeCompany.name}!` })
    )
  })
})
