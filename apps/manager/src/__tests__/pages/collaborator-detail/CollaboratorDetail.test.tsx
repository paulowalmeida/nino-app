import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { describe, expect, it, vi } from 'vitest'

import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { useStaffDetail } from '@hooks/team/useStaffDetail'

import {
  CollaboratorDetail,
} from '@pages/collaborator-detail/CollaboratorDetail'

import { currentTenant, staffDetail } from './CollaboratorDetail.mock'

vi.mock('@hooks/session/useCurrentTenant')
vi.mock('@hooks/team/useStaffDetail')

const renderDetail = () =>
  render(
    <MemoryRouter initialEntries={['/colaboradores/user-1']}>
      <Routes>
        <Route
          path="/colaboradores/:userId"
          element={<CollaboratorDetail />}
        />
      </Routes>
    </MemoryRouter>
  )

describe(CollaboratorDetail.name, () => {
  it('shows the collaborator summary once loaded', () => {
    // Arrange
    vi.mocked(useCurrentTenant).mockReturnValue(currentTenant)
    vi.mocked(useStaffDetail).mockReturnValue({
      data: staffDetail,
      isPending: false,
    } as unknown as ReturnType<typeof useStaffDetail>)

    // Act
    renderDetail()

    // Assert
    expect(
      screen.getByRole('heading', { name: 'João Pereira' })
    ).toBeInTheDocument()
    expect(screen.getByText('Atendente')).toBeInTheDocument()
  })

  it('shows the empty state when the person left the store', () => {
    // Arrange
    vi.mocked(useCurrentTenant).mockReturnValue(currentTenant)
    vi.mocked(useStaffDetail).mockReturnValue({
      data: undefined,
      isPending: false,
    } as unknown as ReturnType<typeof useStaffDetail>)

    // Act
    renderDetail()

    // Assert
    expect(
      screen.getByText('Esta pessoa não está mais nesta loja.')
    ).toBeInTheDocument()
  })
})
