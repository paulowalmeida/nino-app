import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ProductDetailShell } from './ProductDetailShell'
import { productDetailShellMock } from './ProductDetailShell.mock'

vi.mock('@nino/ds/components/Modal', () => ({
  Modal: ({
    body,
    footer,
    size,
    dismissible,
  }: {
    body?: ReactNode
    footer?: ReactNode
    size?: string
    dismissible?: boolean
  }) => (
    <div data-testid="modal" data-dismissible={dismissible} data-size={size}>
      {body}
      {footer}
    </div>
  ),
}))

vi.mock('@nino/ds/components/Box', () => ({
  Box: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
}))

vi.mock('@nino/ds/components/Button', () => ({
  Button: ({
    children,
    onClick,
  }: {
    children?: ReactNode
    onClick?: () => void
  }) => <button onClick={onClick}>{children}</button>,
}))

vi.mock('@nino/ds/components/Icon', () => ({
  Icon: () => <span aria-hidden="true" />,
}))

describe('ProductDetailShell', () => {
  beforeEach(() => vi.spyOn(window, 'scrollTo').mockImplementation(() => {}))
  afterEach(() => vi.restoreAllMocks())

  it('always renders the product details through the Modal', () => {
    render(
      <ProductDetailShell
        isDesktop={false}
        ariaLabel={productDetailShellMock.ariaLabel}
        onClose={vi.fn()}
        media={<div>{productDetailShellMock.media}</div>}
        details={<p>{productDetailShellMock.details}</p>}
      />
    )

    expect(screen.getByTestId('modal')).toBeInTheDocument()
    expect(screen.getByText('Imagem do produto')).toBeInTheDocument()
    expect(screen.getByText('Escolhas do produto')).toBeInTheDocument()
  })

  it('places the sticky identity inside the scrollable details owner', () => {
    render(
      <ProductDetailShell
        isDesktop={false}
        ariaLabel={productDetailShellMock.ariaLabel}
        onClose={vi.fn()}
        media={null}
        stickyDetails={<p>{productDetailShellMock.ariaLabel}</p>}
        details={<p>{productDetailShellMock.details}</p>}
      />
    )

    expect(
      screen.getByText(productDetailShellMock.ariaLabel)
    ).toBeInTheDocument()
    expect(screen.getByText(productDetailShellMock.details)).toBeInTheDocument()
  })

  it('keeps only the back button on mobile/tablet, without a close X', () => {
    const onClose = vi.fn()

    render(
      <ProductDetailShell
        isDesktop={false}
        ariaLabel={productDetailShellMock.ariaLabel}
        onClose={onClose}
        media={null}
        details={<p>{productDetailShellMock.details}</p>}
      />
    )

    expect(screen.getByTestId('modal')).toHaveAttribute(
      'data-dismissible',
      'false'
    )

    screen.getByRole('button').click()

    expect(onClose).toHaveBeenCalledOnce()
  })

  it('hides the back button and enables the close X on desktop', () => {
    render(
      <ProductDetailShell
        isDesktop
        ariaLabel={productDetailShellMock.ariaLabel}
        onClose={vi.fn()}
        media={null}
        details={<p>{productDetailShellMock.details}</p>}
      />
    )

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.getByTestId('modal')).toHaveAttribute(
      'data-dismissible',
      'true'
    )
  })

  it('scrolls to the top when the mobile/tablet detail opens', () => {
    render(
      <ProductDetailShell
        isDesktop={false}
        ariaLabel={productDetailShellMock.ariaLabel}
        onClose={vi.fn()}
        media={null}
        details={<p>{productDetailShellMock.details}</p>}
      />
    )

    expect(vi.mocked(window.scrollTo)).toHaveBeenCalledWith(0, 0)
  })

  it('pins the footer outside the scrolling body', () => {
    render(
      <ProductDetailShell
        isDesktop={false}
        ariaLabel={productDetailShellMock.ariaLabel}
        onClose={vi.fn()}
        media={null}
        details={<p>{productDetailShellMock.details}</p>}
        footer={<p>{productDetailShellMock.footer}</p>}
      />
    )

    expect(screen.getByText(productDetailShellMock.footer)).toBeInTheDocument()
  })

  it('fills the whole screen on mobile and uses the large panel on desktop', () => {
    const { rerender } = render(
      <ProductDetailShell
        isDesktop={false}
        ariaLabel={productDetailShellMock.ariaLabel}
        onClose={vi.fn()}
        media={null}
        details={<p>{productDetailShellMock.details}</p>}
      />
    )

    expect(screen.getByTestId('modal')).toHaveAttribute('data-size', 'full')

    rerender(
      <ProductDetailShell
        isDesktop
        ariaLabel={productDetailShellMock.ariaLabel}
        onClose={vi.fn()}
        media={null}
        details={<p>{productDetailShellMock.details}</p>}
      />
    )

    expect(screen.getByTestId('modal')).toHaveAttribute('data-size', 'lg')
  })
})
