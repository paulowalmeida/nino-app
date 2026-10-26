import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { CollaboratorDetail } from '@pages/CollaboratorDetail/CollaboratorDetail'
import { useCollaboratorDetailFacade } from '@pages/CollaboratorDetail/facades/useCollaboratorDetailFacade/useCollaboratorDetailFacade'

vi.mock(
  '@pages/CollaboratorDetail/facades/useCollaboratorDetailFacade/useCollaboratorDetailFacade'
)
vi.mock(
  '@pages/CollaboratorDetail/components/CollaboratorHeader/CollaboratorHeader',
  () => ({ CollaboratorHeader: () => <div>header</div> })
)
vi.mock(
  '@pages/CollaboratorDetail/components/CollaboratorContact/CollaboratorContact',
  () => ({ CollaboratorContact: () => <div>contact</div> })
)
vi.mock(
  '@pages/CollaboratorDetail/components/CollaboratorWorkspace/CollaboratorWorkspace',
  () => ({ CollaboratorWorkspace: () => <div>workspace</div> })
)
vi.mock(
  '@pages/CollaboratorDetail/skeletons/CollaboratorDetailSkeleton/CollaboratorDetailSkeleton',
  () => ({ CollaboratorDetailSkeleton: () => <div>loading</div> })
)

const member = { user: { name: 'Ana Souza' } }

describe(CollaboratorDetail.name, () => {
  beforeEach(() => {
    vi.mocked(useCollaboratorDetailFacade).mockReturnValue({
      member,
      isPending: false,
      isError: false,
    } as never)
  })

  it('composes the collaborator detail regions', () => {
    render(
      <MemoryRouter>
        <CollaboratorDetail />
      </MemoryRouter>
    )
    expect(screen.getByText('header')).toBeInTheDocument()
    expect(screen.getByText('contact')).toBeInTheDocument()
    expect(screen.getByText('workspace')).toBeInTheDocument()
  })

  it('governs loading, error, and missing-member branches', () => {
    vi.mocked(useCollaboratorDetailFacade).mockReturnValue({
      member: undefined,
      isPending: true,
      isError: false,
    } as never)
    const loading = render(
      <MemoryRouter>
        <CollaboratorDetail />
      </MemoryRouter>
    )
    expect(screen.getByText('loading')).toBeInTheDocument()
    loading.unmount()

    vi.mocked(useCollaboratorDetailFacade).mockReturnValue({
      member: undefined,
      isPending: false,
      isError: true,
    } as never)
    const error = render(
      <MemoryRouter>
        <CollaboratorDetail />
      </MemoryRouter>
    )
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Não foi possível carregar'
    )
    error.unmount()

    vi.mocked(useCollaboratorDetailFacade).mockReturnValue({
      member: undefined,
      isPending: false,
      isError: false,
    } as never)
    render(
      <MemoryRouter>
        <CollaboratorDetail />
      </MemoryRouter>
    )
    expect(
      screen.getByText('Esta pessoa não está mais nesta loja.')
    ).toBeInTheDocument()
  })
})
