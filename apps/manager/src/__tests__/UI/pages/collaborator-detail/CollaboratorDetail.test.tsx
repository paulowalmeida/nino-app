import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { describe, expect, it, vi } from 'vitest'

import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { useStaffDetail } from '@hooks/team/useStaffDetail'
import {
  CollaboratorDetail,
} from '@pages/collaborator-detail/CollaboratorDetail'

import {
  counterTicketEntry,
  currentTenant,
  staffDetail,
} from './CollaboratorDetail.mock'

vi.mock('@hooks/session/useCurrentTenant')
vi.mock('@hooks/team/useStaffDetail')

const renderDetail = () =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter initialEntries={['/colaboradores/user-1']}>
        <Routes>
          <Route
            path="/colaboradores/:userId"
            element={<CollaboratorDetail />}
          />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
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
    expect(screen.getAllByText(/Atendente/).length).toBeGreaterThan(0)
    expect(screen.getByText('R$ 1.284,50')).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Acesso' })).toBeInTheDocument()
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

  it('shows an error instead of treating a failed request as a missing person', () => {
    // Arrange
    vi.mocked(useCurrentTenant).mockReturnValue(currentTenant)
    vi.mocked(useStaffDetail).mockReturnValue({
      data: undefined,
      isPending: false,
      isError: true,
    } as unknown as ReturnType<typeof useStaffDetail>)

    // Act
    renderDetail()

    // Assert
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Não foi possível carregar a pessoa'
    )
    expect(
      screen.queryByText('Esta pessoa não está mais nesta loja.')
    ).not.toBeInTheDocument()
  })

  it('shows a skeleton while the request is pending', () => {
    // Arrange
    vi.mocked(useCurrentTenant).mockReturnValue(currentTenant)
    vi.mocked(useStaffDetail).mockReturnValue({
      data: undefined,
      isPending: true,
    } as unknown as ReturnType<typeof useStaffDetail>)

    // Act
    renderDetail()

    // Assert
    expect(screen.getByRole('status')).toHaveTextContent(
      'Carregando colaborador'
    )
  })

  it('shows the empty activity message when nothing was handled yet', () => {
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
      screen.getByText('Nenhum pedido passou pela mão desta pessoa ainda.')
    ).toBeInTheDocument()
  })

  it('lists the activity entries when there is order history', () => {
    // Arrange
    vi.mocked(useCurrentTenant).mockReturnValue(currentTenant)
    vi.mocked(useStaffDetail).mockReturnValue({
      data: { ...staffDetail, activity: [counterTicketEntry] },
      isPending: false,
    } as unknown as ReturnType<typeof useStaffDetail>)

    // Act
    renderDetail()

    // Assert
    expect(screen.getByText('Maria Silva')).toBeInTheDocument()
  })
})
