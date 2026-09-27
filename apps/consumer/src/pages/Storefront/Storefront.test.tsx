import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { useStorefrontFacade } from '@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade'

import { Storefront } from './Storefront'
import { storefrontPathMock, storefrontStoreMock } from './Storefront.mock'

const { useOutletMock } = vi.hoisted(() => ({
  useOutletMock: vi.fn<() => ReactNode>(() => null),
}))
const useParamsMock = vi.hoisted(() =>
  vi.fn<() => { slug: string; productId?: string }>(() => ({
    slug: 'loja-do-ze',
  }))
)

vi.mock('react-router', () => ({
  useParams: useParamsMock,
  useOutlet: useOutletMock,
}))
vi.mock(
  '@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade',
  () => ({
    useStorefrontFacade: vi.fn(),
  })
)
vi.mock('@nino/ds/components/Box', () => ({
  Box: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}))
vi.mock(
  '@pages/Storefront/components/StoreLookupEmptyState/StoreLookupEmptyState',
  () => ({
    StoreLookupEmptyState: ({ title }: { title: string }) => <div>{title}</div>,
  })
)
vi.mock(
  '@pages/Storefront/skeletons/StorefrontSkeleton/StorefrontSkeleton',
  () => ({
    StorefrontSkeleton: () => <div>carregando loja</div>,
  })
)
vi.mock(
  '@pages/Storefront/components/StorefrontContent/StorefrontContent',
  () => ({
    StorefrontContent: ({ pathSlug }: { pathSlug?: string }) => (
      <div>conteúdo {pathSlug}</div>
    ),
  })
)

describe('Storefront', () => {
  it('renders the store content after the store is available', () => {
    useParamsMock.mockReturnValue({
      slug: storefrontPathMock.slug,
      productId: undefined,
    })
    useOutletMock.mockReturnValue(<></>)
    vi.mocked(useStorefrontFacade).mockReturnValue({
      store: storefrontStoreMock,
      isStorePending: false,
      isStoreError: false,
    } as never)

    render(<Storefront />)

    expect(screen.getByText('conteúdo loja-do-ze')).toBeInTheDocument()
  })

  it('keeps the store content mounted behind the product route', () => {
    useParamsMock.mockReturnValue({
      slug: storefrontPathMock.slug,
      productId: 'product-1',
    })
    useOutletMock.mockReturnValue(<p>detalhe do produto</p>)
    vi.mocked(useStorefrontFacade).mockReturnValue({
      store: storefrontStoreMock,
      isStorePending: false,
      isStoreError: false,
    } as unknown as ReturnType<typeof useStorefrontFacade>)

    render(<Storefront />)

    expect(screen.getByText('detalhe do produto')).toBeInTheDocument()
    expect(screen.getByText('conteúdo loja-do-ze')).toBeInTheDocument()
  })

  it('renders the loading state while the store is pending', () => {
    useParamsMock.mockReturnValue({
      slug: storefrontPathMock.slug,
      productId: undefined,
    })
    useOutletMock.mockReturnValue(null)
    vi.mocked(useStorefrontFacade).mockReturnValue({
      store: undefined,
      isStorePending: true,
      isStoreError: false,
    } as never)

    render(<Storefront />)

    expect(screen.getByText('carregando loja')).toBeInTheDocument()
  })
})
