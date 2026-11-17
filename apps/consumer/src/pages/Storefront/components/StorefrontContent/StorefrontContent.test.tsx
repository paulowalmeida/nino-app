import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useStorefrontFacade } from '@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade'

import { StorefrontContent } from './StorefrontContent'
import {
  homeContentMock,
  menuSectionWithImageMock,
} from './StorefrontContent.mock'
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
vi.mock(
  '@pages/Storefront/components/StorefrontCouponsDrawer/StorefrontCouponsDrawer',
  () => ({ StorefrontCouponsDrawer: () => null })
)
vi.mock('@hooks/useScrollProgress/useScrollProgress', () => ({
  useScrollProgress: () => 0,
}))
vi.mock('@pages/Storefront/hooks/useImagePreload/useImagePreload', () => ({
  useImagePreload: vi.fn(() => false),
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
    MenuSection: ({ section }: { section: { name: string } }) => (
      <div>seção {section.name}</div>
    ),
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
vi.mock(
  '@pages/Storefront/components/StoreMenu/MenuSearchModal/MenuSearchModal',
  () => ({ MenuSearchModal: emptyComponent })
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
  '@pages/Storefront/components/StoreHeader/PromotionBanner/PromotionBanner',
  () => ({
    PromotionBanner: emptyComponent,
  })
)
vi.mock(
  '@pages/Storefront/skeletons/MenuRowsSkeleton/MenuRowsSkeleton',
  () => ({
    MenuRowsSkeleton: () => <div>carregando cardápio</div>,
  })
)
vi.mock(
  '@pages/Storefront/skeletons/StoreHeaderSkeleton/StoreHeaderSkeleton',
  () => ({
    StoreHeaderSkeleton: () => <div>carregando cabeçalho</div>,
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
  beforeEach(async () => {
    const { useImagePreload } =
      await import('@pages/Storefront/hooks/useImagePreload/useImagePreload')
    vi.mocked(useImagePreload).mockReset()
    vi.mocked(useImagePreload).mockReturnValue(false)
  })

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
      promotionPanelOffers: [],
      cartTotal: 0,
      visibleSections: [],
      isMenuError: false,
      retryMenu: vi.fn(),
      packageOffers: [],
      reset: vi.fn(),
    } as never)

    render(<StorefrontContent pathSlug={homeContentMock.pathSlug} />)

    expect(screen.getByText('identidade da loja')).toBeInTheDocument()
  })

  it('keeps the real header hidden while its data is pending', () => {
    vi.mocked(useStorefrontFacade).mockReturnValue({
      store: homeStoreMock,
      isHeaderPending: true,
      search: '',
      sections: [],
      isMenuPending: true,
      isHoursPending: true,
      hours: [],
      cart: {},
      cartLines: [],
      cartCount: 0,
      promotionPanelOffers: [],
      cartTotal: 0,
      visibleSections: [],
      isMenuError: false,
      retryMenu: vi.fn(),
      packageOffers: [],
      reset: vi.fn(),
    } as never)

    render(<StorefrontContent pathSlug={homeContentMock.pathSlug} />)

    expect(screen.getByText('carregando cabeçalho')).toBeInTheDocument()
    expect(screen.queryByText('identidade da loja')).not.toBeInTheDocument()
  })

  it('keeps menu cards behind the skeleton until every menu image is ready', async () => {
    const { useImagePreload } =
      await import('@pages/Storefront/hooks/useImagePreload/useImagePreload')
    vi.mocked(useImagePreload).mockImplementation((target) =>
      Array.isArray(target)
    )
    vi.mocked(useStorefrontFacade).mockReturnValue({
      store: homeStoreMock,
      search: '',
      sections: [menuSectionWithImageMock],
      isMenuPending: false,
      isHoursPending: false,
      hours: [],
      estimatedMinutes: 15,
      cart: {},
      cartLines: [],
      cartCount: 0,
      promotionPanelOffers: [],
      cartTotal: 0,
      visibleSections: [menuSectionWithImageMock],
      isMenuError: false,
      retryMenu: vi.fn(),
      packageOffers: [],
      reset: vi.fn(),
    } as never)

    render(<StorefrontContent pathSlug={homeContentMock.pathSlug} />)

    expect(screen.getByText('carregando cardápio')).toBeInTheDocument()
    expect(screen.queryByText('seção Hambúrgueres')).not.toBeInTheDocument()
  })

  it('does not filter the menu while the search is typed', () => {
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
      promotionPanelOffers: [],
      cartTotal: 0,
      visibleSections: homeContentMock.sections,
      isMenuError: false,
      retryMenu: vi.fn(),
      packageOffers: [],
      reset: vi.fn(),
    } as never)

    render(<StorefrontContent pathSlug={homeContentMock.pathSlug} />)

    expect(screen.getByText('categorias filtradas')).toBeInTheDocument()
    expect(screen.queryByText('Nenhum item encontrado')).not.toBeInTheDocument()
  })
})
