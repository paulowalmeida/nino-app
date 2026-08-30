import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { useStorefrontFacade } from '@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade'

import { Storefront } from './Storefront'
import { storefrontPathMock, storefrontStoreMock } from './Storefront.mock'

vi.mock('react-router', () => ({
  useParams: () => ({ slug: storefrontPathMock.slug }),
}))
vi.mock('@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade', () => ({
  useStorefrontFacade: vi.fn(),
}))
vi.mock('@nino/ds/components/Box', () => ({
  Box: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}))
vi.mock(
  '@pages/Storefront/components/StoreLookupEmptyState/StoreLookupEmptyState',
  () => ({
    StoreLookupEmptyState: ({ title }: { title: string }) => <div>{title}</div>,
  })
)
vi.mock('@pages/Storefront/skeletons/StorefrontSkeleton/StorefrontSkeleton', () => ({
  StorefrontSkeleton: () => <div>carregando loja</div>,
}))
vi.mock('@pages/Storefront/components/StorefrontContent/StorefrontContent', () => ({
  StorefrontContent: ({ pathSlug }: { pathSlug?: string }) => (
    <div>conteúdo {pathSlug}</div>
  ),
}))

describe('Storefront', () => {
  it('renders the store content after the store is available', () => {
    vi.mocked(useStorefrontFacade).mockReturnValue({
      store: storefrontStoreMock,
      isStorePending: false,
      isStoreError: false,
    } as never)

    render(<Storefront />)

    expect(screen.getByText('conteúdo loja-do-ze')).toBeInTheDocument()
  })

  it('renders the loading state while the store is pending', () => {
    vi.mocked(useStorefrontFacade).mockReturnValue({
      store: undefined,
      isStorePending: true,
      isStoreError: false,
    } as never)

    render(<Storefront />)

    expect(screen.getByText('carregando loja')).toBeInTheDocument()
  })
})
