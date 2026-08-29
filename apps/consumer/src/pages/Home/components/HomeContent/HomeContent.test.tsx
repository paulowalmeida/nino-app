import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { useHomeFacade } from '@pages/Home/facades/useHomeFacade/useHomeFacade'

import { HomeContent } from './HomeContent'
import { homeContentMock } from './HomeContent.mock'
import { homeStoreMock } from '../../Home.mock'

vi.mock('react-router', () => ({ useNavigate: () => vi.fn() }))
vi.mock('@pages/Home/facades/useHomeFacade/useHomeFacade', () => ({
  useHomeFacade: vi.fn(),
}))
vi.mock('@pages/Home/hooks/useMenuSections/useMenuSections', () => ({
  useMenuSections: () => ({
    visibleSections: [],
    activeId: undefined,
    goToSection: vi.fn(),
    sectionDomId: (id: string) => id,
    isSearching: false,
  }),
}))
vi.mock('@hooks/useScrollProgress/useScrollProgress', () => ({ useScrollProgress: () => 0 }))
vi.mock('@nino/ds/components/Box', () => ({
  Box: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}))

const { emptyComponent } = vi.hoisted(() => ({
  emptyComponent: ({ children }: { children?: ReactNode }) => (
    <div>{children}</div>
  ),
}))
vi.mock(
  '@pages/Home/components/HomeContent/ActiveOrderBanner/ActiveOrderBanner',
  () => ({ ActiveOrderBanner: emptyComponent })
)
vi.mock('@pages/Home/components/HomeContent/CartDock/CartDock', () => ({
  CartDock: emptyComponent,
}))
vi.mock('@pages/Home/components/HomeContent/CartDrawer/CartDrawer', () => ({
  CartDrawer: emptyComponent,
}))
vi.mock('@pages/Home/components/HomeContent/CategoryNav/CategoryNav', () => ({
  CategoryNav: emptyComponent,
}))
vi.mock('@pages/Home/components/HomeContent/MenuSection/MenuSection', () => ({
  MenuSection: emptyComponent,
}))
vi.mock(
  '@pages/Home/components/HomeContent/ProductDetail/ProductDetail',
  () => ({ ProductDetail: emptyComponent })
)
vi.mock(
  '@pages/Home/components/HomeContent/StoreIdentity/StoreIdentity',
  () => ({ StoreIdentity: () => <div>identidade da loja</div> })
)
vi.mock('@pages/Home/components/HomeContent/StoreInfo/StoreInfo', () => ({
  StoreInfo: emptyComponent,
}))
vi.mock('@pages/Home/components/HomeContent/StoreTopBar/StoreTopBar', () => ({
  StoreTopBar: emptyComponent,
}))
vi.mock('@shared/components/TabBar/TabBar/TabBar', () => ({
  TabBar: emptyComponent,
}))
vi.mock('@pages/Home/components/HomeContent/CategoryBar/CategoryBar', () => ({
  CategoryBar: emptyComponent,
}))
vi.mock(
  '@pages/Home/components/HomeContent/MenuSearchField/MenuSearchField',
  () => ({ MenuSearchField: emptyComponent })
)
vi.mock('@shared/components/PoweredBy/PoweredBy', () => ({
  PoweredBy: emptyComponent,
}))
vi.mock('@pages/Home/components/HomeContent/StoreBanner/StoreBanner', () => ({
  StoreBanner: emptyComponent,
}))
vi.mock('@pages/Home/skeletons/MenuRowsSkeleton/MenuRowsSkeleton', () => ({
  MenuRowsSkeleton: emptyComponent,
}))

vi.mock('@nino/ds/components/EmptyState', () => ({
  EmptyState: emptyComponent,
}))

describe('HomeContent', () => {
  it('renders the menu shell using the feature facade without integration props', () => {
    vi.mocked(useHomeFacade).mockReturnValue({
      store: homeStoreMock,
      sections: homeContentMock.sections,
      isMenuPending: false,
      isHoursPending: false,
      hours: [],
      estimatedMinutes: homeContentMock.pathSlug.length,
      cart: {},
      cartLines: [],
      cartCount: 0,
      cartTotal: 0,
    } as never)

    render(<HomeContent pathSlug={homeContentMock.pathSlug} />)

    expect(screen.getByText('identidade da loja')).toBeInTheDocument()
  })
})
