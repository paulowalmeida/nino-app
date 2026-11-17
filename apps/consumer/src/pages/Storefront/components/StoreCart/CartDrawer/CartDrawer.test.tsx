import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { useStorefrontFacade } from '@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade'

import { CartDrawer } from './CartDrawer'
import { cartDrawerMock } from './CartDrawer.mock'

const navigate = vi.fn()
vi.mock('react-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-router')>()),
  useNavigate: () => navigate,
}))

vi.mock('./CartDrawer.module.css', () => ({
  default: new Proxy({}, { get: (_target, property: string) => property }),
}))

vi.mock(
  '@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade',
  () => ({ useStorefrontFacade: vi.fn() })
)
vi.mock('@nino/ds/components/Drawer', () => ({
  Drawer: ({
    bodyClassName,
    children,
    title,
  }: {
    bodyClassName?: string
    children?: ReactNode
    title?: ReactNode
  }) => (
    <section data-body-class={bodyClassName} data-testid="drawer">
      <h2>{title}</h2>
      {children}
    </section>
  ),
}))
vi.mock('@nino/ds/components/Dialog', () => ({ Dialog: () => null }))
vi.mock('@nino/ds/components/Box', () => ({
  Box: ({
    children,
    className,
  }: {
    children?: ReactNode
    className?: string
  }) => <div className={className}>{children}</div>,
}))
vi.mock('@nino/ds/components/Text', () => ({
  Text: ({
    children,
    className,
  }: {
    children?: ReactNode
    className?: string
  }) => <span className={className}>{children}</span>,
}))
vi.mock('@nino/ds/components/Button', () => ({
  Button: ({
    children,
    className,
    onClick,
    'aria-label': ariaLabel,
  }: {
    children?: ReactNode
    className?: string
    onClick?: () => void
    'aria-label'?: string
  }) => (
    <button
      aria-label={ariaLabel}
      className={className}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  ),
}))
vi.mock('@nino/ds/components/EmptyState', () => ({ EmptyState: () => null }))
vi.mock('@nino/ds/components/Image', () => ({ Image: () => null }))
vi.mock('@nino/ds/components/QuantityStepper', () => ({
  QuantityStepper: () => <div />,
}))
vi.mock('@shared/components/AnimatedNumber/AnimatedNumber', () => ({
  AnimatedNumber: ({
    value,
    className,
  }: {
    value: string
    className?: string
  }) => <span className={className}>{value}</span>,
}))
vi.mock(
  '@pages/Storefront/components/StoreCart/CartDrawer/CartPromotionProgress/CartPromotionProgress',
  () => ({ CartPromotionProgress: () => null })
)
vi.mock('framer-motion', () => ({
  AnimatePresence: ({ children }: { children?: ReactNode }) => children,
  motion: {
    div: ({
      children,
      className,
    }: {
      children?: ReactNode
      className?: string
    }) => <div className={className}>{children}</div>,
  },
}))

describe('CartDrawer', () => {
  it('keeps the item viewport separate from the visible total and checkout CTA', () => {
    vi.mocked(useStorefrontFacade).mockReturnValue({
      isCartOpen: true,
      setCartOpen: vi.fn(),
      cartLines: [
        {
          id: 'line-1',
          quantity: 1,
          item: {
            id: 'product-1',
            name: 'X-Salada',
            imageUrl: null,
            modifiers: [],
            notes: null,
            package: undefined,
          },
        },
      ],
      cartTotal: cartDrawerMock.total,
      estimatedMinutes: 20,
      incrementCartLine: vi.fn(),
      decrementCartLine: vi.fn(),
      clearCart: vi.fn(),
      isDesktop: false,
    } as never)

    const { container } = render(
      <MemoryRouter>
        <CartDrawer />
      </MemoryRouter>
    )

    expect(screen.getByTestId('drawer')).toHaveAttribute(
      'data-body-class',
      expect.stringContaining('cartDrawerViewport')
    )
    expect(container.querySelector('.cartDrawerBody')).toBeInTheDocument()
    expect(screen.getByText('Total')).toBeInTheDocument()
    expect(screen.getByText('R$ 25,00')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Finalizar pedido' })
    ).toBeInTheDocument()
  })

  it('opens the product modal in edit mode for the tapped line', () => {
    const setCartOpen = vi.fn()
    vi.mocked(useStorefrontFacade).mockReturnValue({
      isCartOpen: true,
      setCartOpen,
      cartLines: cartDrawerMock.lines,
      cartTotal: cartDrawerMock.total,
      estimatedMinutes: null,
      incrementCartLine: vi.fn(),
      decrementCartLine: vi.fn(),
      clearCart: vi.fn(),
      isDesktop: false,
    } as never)

    render(
      <MemoryRouter>
        <CartDrawer />
      </MemoryRouter>
    )
    fireEvent.click(screen.getByRole('button', { name: 'Editar X-Salada' }))

    expect(setCartOpen).toHaveBeenCalledWith(false)
    expect(navigate).toHaveBeenCalledWith(
      `/produto/product-1?linha=${encodeURIComponent('line|1')}`
    )
    expect(
      screen.queryByRole('button', { name: 'Editar Combo' })
    ).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Esvaziar' })).toBeInTheDocument()
  })
})
