import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { CollaboratorRoleAccess } from './CollaboratorRoleAccess'
import { collaboratorRoleAccessMock } from './CollaboratorRoleAccess.mock'

const renderRoleAccess = (
  onChangePosition = vi.fn(),
  isChangingPosition = false
) =>
  render(
    <CollaboratorRoleAccess
      current={collaboratorRoleAccessMock.current}
      promotionOptions={collaboratorRoleAccessMock.promotionOptions}
      isChangingPosition={isChangingPosition}
      onChangePosition={onChangePosition}
    />
  )

describe(CollaboratorRoleAccess.name, () => {
  it('titles the choice as the collaborator cargo', () => {
    renderRoleAccess()

    expect(screen.getByRole('heading', { name: 'Cargo' })).toBeInTheDocument()
  })

  it('offers the current cargo and only the ones a promotion can reach', () => {
    renderRoleAccess()

    expect(screen.getByLabelText(/Atendente/)).toBeChecked()
    expect(screen.getByLabelText(/Caixa/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Gerente/)).toBeInTheDocument()
    expect(
      screen.queryByText(collaboratorRoleAccessMock.hiddenRoleLabel)
    ).not.toBeInTheDocument()
  })

  it('promotes to the chosen cargo', async () => {
    const onChangePosition = vi.fn()
    renderRoleAccess(onChangePosition)

    await userEvent.click(screen.getByLabelText(/Gerente/))

    expect(onChangePosition).toHaveBeenCalledWith('position-manager')
  })

  it('ignores a click on the cargo already held', async () => {
    const onChangePosition = vi.fn()
    renderRoleAccess(onChangePosition)

    await userEvent.click(screen.getByLabelText(/Atendente/))

    expect(onChangePosition).not.toHaveBeenCalled()
  })

  it('locks the choice while the change is saved', () => {
    renderRoleAccess(vi.fn(), true)

    screen
      .getAllByRole('radio')
      .forEach((option) => expect(option).toBeDisabled())
  })
})
