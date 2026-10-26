import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ProductDetailShell } from './ProductDetailShell'
import { productDetailShellMock } from './ProductDetailShell.mock'

vi.mock('@nino/ds/components/Modal', () => ({
  Modal: ({
    body,
    dismissible,
  }: {
    body?: ReactNode
    dismissible?: boolean
  }) => (
    <div data-testid="modal" data-dismissible={dismissible}>
      {body}
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
})
