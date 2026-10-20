import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { CollaboratorAccess } from './CollaboratorAccess'
import {
  collaboratorAccessMemberOf,
  collaboratorAccessPromotionOptionsMock,
} from './CollaboratorAccess.mock'

const renderAccess = (
  member: ReturnType<typeof collaboratorAccessMemberOf>,
  canChangePosition: boolean
) =>
  render(
    <CollaboratorAccess
      member={member}
      canChangePosition={canChangePosition}
      promotionOptions={collaboratorAccessPromotionOptionsMock}
      isChangingPosition={false}
      onChangePosition={vi.fn()}
      onOpenEmailModal={vi.fn()}
      onOpenRemovalConfirm={vi.fn()}
    />
  )

describe(CollaboratorAccess.name, () => {
  it('shows pending invitation and disabled-account warnings', () => {
    renderAccess(collaboratorAccessMemberOf(null, false), true)

    expect(screen.getByText(/Convite ainda não aceito/)).toBeInTheDocument()
    expect(screen.getByText(/A conta está desativada/)).toBeInTheDocument()
  })

  it('shows access controls for a completed active collaborator', () => {
    renderAccess(collaboratorAccessMemberOf('2024-01-01', true), true)

    expect(screen.getByRole('region', { name: 'Acesso' })).toBeInTheDocument()
    expect(
      screen.queryByText(/Convite ainda não aceito/)
    ).not.toBeInTheDocument()
  })

  it('shows the cargo choice only when the viewer can change it', () => {
    const { unmount } = renderAccess(
      collaboratorAccessMemberOf('2024-01-01', true),
      true
    )
    expect(screen.getByRole('heading', { name: 'Cargo' })).toBeInTheDocument()
    unmount()

    renderAccess(collaboratorAccessMemberOf('2024-01-01', true), false)
    expect(
      screen.queryByRole('heading', { name: 'Cargo' })
    ).not.toBeInTheDocument()
  })
})
