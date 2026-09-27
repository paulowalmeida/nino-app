import { fireEvent, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { useStorefrontFacade } from '@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade'

import { StorefrontContent } from './StorefrontContent'
import { homeContentMock } from './StorefrontContent.mock'
import { storefrontStoreMock as homeStoreMock } from '../../Storefront.mock'

vi.mock('react-router', () => ({
  useNavigate: () => vi.fn(),
  useParams: () => ({ slug: 'pizzaria' }),
}))
vi.mock('@hooks/useStoreHome/useStoreHome', () => ({
  useStoreHome: () => ({
    showBanner: true,
    showSearch: true,
    showCategoryBar: true,
    showStoreInfo: true,
  }),
}))
vi.mock(
  '@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade',
  () => ({
    useStorefrontFacade: vi.fn(),
  })
)
vi.mock('@hooks/useScrollProgress/useScrollProgress', () => ({
  useScrollProgress: () => 0,
}))
vi.mock('@nino/ds/components/Box', () => ({
  Box: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}))

const { emptyComponent } = vi.hoisted(() => ({
  emptyComponent: ({ children }: { children?: ReactNode }) => (
    <div>{children}</div>
  ),
}))
vi.mock(
  '@pages/Storefront/components/ActiveOrderBanner/ActiveOrderBanner',
  () => ({ ActiveOrderBanner: emptyComponent })
)
vi.mock('@pages/Storefront/components/StoreCart/StoreCart', () => ({
  StoreCart: emptyComponent,
}))
vi.mock(
  '@pages/Storefront/components/StoreMenu/CategoryNav/CategoryNav',
  () => ({
    CategoryNav: () => <div>categorias filtradas</div>,
  })
)
vi.mock(
  '@pages/Storefront/components/StoreMenu/MenuSection/MenuSection',
  () => ({
    MenuSection: emptyComponent,
  })
)
vi.mock(
  '@pages/Storefront/components/StoreMenu/ProductDetail/ProductDetail',
  () => ({ ProductDetail: emptyComponent })
)
vi.mock(
  '@pages/Storefront/components/StoreHeader/StoreIdentity/StoreIdentity',
  () => ({ StoreIdentity: () => <div>identidade da loja</div> })
)
vi.mock(
  '@pages/Storefront/components/StoreHeader/StoreAvailabilityBanner/StoreAvailabilityBanner',
  () => ({ StoreAvailabilityBanner: emptyComponent })
)
vi.mock('@pages/Storefront/components/StoreHeader/StoreInfo/StoreInfo', () => ({
  StoreInfo: emptyComponent,
}))
vi.mock(
  '@pages/Storefront/components/StoreHeader/StoreTopBar/StoreTopBar',
  () => ({
    StoreTopBar: emptyComponent,
  })
)
vi.mock('@shared/components/TabBar/TabBar/TabBar', () => ({
  TabBar: emptyComponent,
}))
vi.mock(
  '@pages/Storefront/components/StoreMenu/CategoryBar/CategoryBar',
  () => ({
    CategoryBar: emptyComponent,
  })
)
vi.mock(
  '@pages/Storefront/components/StoreMenu/MenuSearchField/MenuSearchField',
  () => ({ MenuSearchField: emptyComponent })
)
vi.mock('@shared/components/PoweredBy/PoweredBy', () => ({
  PoweredBy: emptyComponent,
}))
vi.mock(
  '@pages/Storefront/components/StoreHeader/StoreBanner/StoreBanner',
  () => ({
    StoreBanner: emptyComponent,
  })
)
vi.mock(
  '@pages/Storefront/skeletons/MenuRowsSkeleton/MenuRowsSkeleton',
  () => ({
    MenuRowsSkeleton: emptyComponent,
  })
)

vi.mock('@nino/ds/components/EmptyState', () => ({
  EmptyState: ({
    title,
    action,
    children,
  }: {
    title?: string
    action?: ReactNode
    children?: ReactNode
  }) => (
    <div>
      {title && <h2>{title}</h2>}
      {children}
      {action}
    </div>
  ),
}))

describe('StorefrontContent', () => {
  it('renders the menu shell using the feature facade without integration props', () => {
    vi.mocked(useStorefrontFacade).mockReturnValue({
      store: homeStoreMock,
      search: '',
      sections: homeContentMock.sections,
      isMenuPending: false,
      isHoursPending: false,
      hours: [],
      estimatedMinutes: homeContentMock.pathSlug.length,
      cart: {},
      cartLines: [],
      cartCount: 0,
      cartTotal: 0,
      visibleSections: [],
      isSearching: false,
      isMenuError: false,
      retryMenu: vi.fn(),
      reset: vi.fn(),
    } as never)

    render(<StorefrontContent pathSlug={homeContentMock.pathSlug} />)

    expect(screen.getByText('identidade da loja')).toBeInTheDocument()
  })

  it('scrolls to the top when searching for a product', () => {
    const scrollTo = vi
      .spyOn(window, 'scrollTo')
      .mockImplementation(() => undefined)
    vi.mocked(useStorefrontFacade).mockReturnValue({
      store: homeStoreMock,
      search: 'burger',
      sections: homeContentMock.sections,
      isMenuPending: false,
      isHoursPending: false,
      hours: [],
      estimatedMinutes: homeContentMock.pathSlug.length,
      cart: {},
      cartLines: [],
      cartCount: 0,
      cartTotal: 0,
      visibleSections: homeContentMock.sections,
      isSearching: true,
      isMenuError: false,
      retryMenu: vi.fn(),
      reset: vi.fn(),
    } as never)

    render(<StorefrontContent pathSlug={homeContentMock.pathSlug} />)

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
    expect(screen.getByText('categorias filtradas')).toBeInTheDocument()
    scrollTo.mockRestore()
  })

  it('offers a way to recover when the search has no results', () => {
    const setSearch = vi.fn()
    vi.mocked(useStorefrontFacade).mockReturnValue({
      store: homeStoreMock,
      search: 'pizza',
      setSearch,
      sections: homeContentMock.sections,
      isMenuPending: false,
      isHoursPending: false,
      hours: [],
      estimatedMinutes: homeContentMock.pathSlug.length,
      cart: {},
      cartLines: [],
      cartCount: 0,
      cartTotal: 0,
      visibleSections: [],
      isSearching: true,
      isMenuError: false,
      retryMenu: vi.fn(),
      reset: vi.fn(),
    } as never)

    render(<StorefrontContent pathSlug={homeContentMock.pathSlug} />)

    expect(screen.getByText('Nenhum item encontrado')).toBeInTheDocument()
    expect(
      screen.getByText(
        'Não encontramos resultados para “pizza”. Tente outro termo.'
      )
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Limpar busca' }))

    expect(setSearch).toHaveBeenCalledWith('')
  })
})
