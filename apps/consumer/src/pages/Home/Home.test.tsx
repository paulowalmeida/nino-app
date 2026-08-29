import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { useHomeFacade } from '@pages/Home/facades/useHomeFacade/useHomeFacade'

import { Home } from './Home'
import { homePathMock, homeStoreMock } from './Home.mock'

vi.mock('react-router', () => ({
  useParams: () => ({ slug: homePathMock.slug }),
}))
vi.mock('@pages/Home/facades/useHomeFacade/useHomeFacade', () => ({ useHomeFacade: vi.fn() }))
vi.mock('@nino/ds/components/Box', () => ({
  Box: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}))
vi.mock('@elements/StoreLookupEmptyState/StoreLookupEmptyState', () => ({
  StoreLookupEmptyState: ({ title }: { title: string }) => <div>{title}</div>,
}))
vi.mock('@pages/Home/skeletons/StorefrontSkeleton/StorefrontSkeleton', () => ({
  StorefrontSkeleton: () => <div>carregando loja</div>,
}))
vi.mock('@pages/Home/components/HomeContent/HomeContent', () => ({
  HomeContent: ({ pathSlug }: { pathSlug?: string }) => <div>conteúdo {pathSlug}</div>,
}))

describe('Home', () => {
  it('renders the store content after the store is available', () => {
    vi.mocked(useHomeFacade).mockReturnValue({
      store: homeStoreMock,
      isStorePending: false,
      isStoreError: false,
    } as never)

    render(<Home />)

    expect(screen.getByText('conteúdo loja-do-ze')).toBeInTheDocument()
  })

  it('renders the loading state while the store is pending', () => {
    vi.mocked(useHomeFacade).mockReturnValue({
      store: undefined,
      isStorePending: true,
      isStoreError: false,
    } as never)

    render(<Home />)

    expect(screen.getByText('carregando loja')).toBeInTheDocument()
  })
})
