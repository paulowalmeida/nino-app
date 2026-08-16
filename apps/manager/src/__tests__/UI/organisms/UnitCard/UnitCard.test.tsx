import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { UnitCard } from '@organisms/UnitCard/UnitCard'

import { branchUnit, mainUnit } from './UnitCard.mock'

describe(UnitCard.name, () => {
  it('shows a skeleton while the unit is loading', () => {
    // Arrange / Act
    const { container } = render(
      <UnitCard
        unit={undefined}
        isPending
        isSaving={false}
        isMain={false}
        isPromoting={false}
        onSetMain={vi.fn()}
        onSave={vi.fn()}
      />
    )

    // Assert
    expect(screen.queryByText('Salvar unidade')).not.toBeInTheDocument()
    expect(container.firstChild).not.toBeNull()
  })

  it('fills the form with the loaded unit data', () => {
    // Arrange / Act
    render(
      <UnitCard
        unit={branchUnit}
        isPending={false}
        isSaving={false}
        isMain={false}
        isPromoting={false}
        onSetMain={vi.fn()}
        onSave={vi.fn()}
      />
    )

    // Assert
    expect(screen.getByDisplayValue('Unidade Centro')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Praça da Sé')).toBeInTheDocument()
  })

  it('hides the "tornar matriz" button for the main unit', () => {
    // Arrange / Act
    render(
      <UnitCard
        unit={mainUnit}
        isPending={false}
        isSaving={false}
        isMain
        isPromoting={false}
        onSetMain={vi.fn()}
        onSave={vi.fn()}
      />
    )

    // Assert
    expect(
      screen.queryByRole('button', { name: 'Tornar matriz' })
    ).not.toBeInTheDocument()
    expect(screen.getByText('matriz')).toBeInTheDocument()
  })

  it('calls onSetMain when promoting a branch unit', async () => {
    // Arrange
    const onSetMain = vi.fn()
    render(
      <UnitCard
        unit={branchUnit}
        isPending={false}
        isSaving={false}
        isMain={false}
        isPromoting={false}
        onSetMain={onSetMain}
        onSave={vi.fn()}
      />
    )

    // Act
    await userEvent.click(
      screen.getByRole('button', { name: 'Tornar matriz' })
    )

    // Assert
    expect(onSetMain).toHaveBeenCalledOnce()
  })

  it('keeps save disabled until a field is edited', async () => {
    // Arrange
    render(
      <UnitCard
        unit={branchUnit}
        isPending={false}
        isSaving={false}
        isMain={false}
        isPromoting={false}
        onSetMain={vi.fn()}
        onSave={vi.fn()}
      />
    )
    const save = screen.getByRole('button', { name: 'Salvar unidade' })

    // Assert (before)
    expect(save).toBeDisabled()

    // Act
    await userEvent.type(
      screen.getByDisplayValue('Unidade Centro'),
      ' 2'
    )

    // Assert (after)
    expect(save).toBeEnabled()
  })

  it('sends the edited draft when saving', async () => {
    // Arrange
    const onSave = vi.fn()
    render(
      <UnitCard
        unit={branchUnit}
        isPending={false}
        isSaving={false}
        isMain={false}
        isPromoting={false}
        onSetMain={vi.fn()}
        onSave={onSave}
      />
    )
    await userEvent.type(screen.getByDisplayValue('Unidade Centro'), '!')

    // Act
    await userEvent.click(
      screen.getByRole('button', { name: 'Salvar unidade' })
    )

    // Assert
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ customName: 'Unidade Centro!' })
    )
  })
})
