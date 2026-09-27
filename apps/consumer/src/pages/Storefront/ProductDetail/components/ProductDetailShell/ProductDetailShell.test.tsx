import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { ProductDetailShell } from './ProductDetailShell'
import { productDetailShellMock } from './ProductDetailShell.mock'

vi.mock('@nino/ds/components/Modal', () => ({
  Modal: () => <div data-testid="modal" />,
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
  it('renders mobile product details as a page instead of a drawer', () => {
    render(
      <ProductDetailShell
        isDesktop={false}
        ariaLabel={productDetailShellMock.ariaLabel}
        onClose={vi.fn()}
        media={<div>{productDetailShellMock.media}</div>}
        details={<p>{productDetailShellMock.details}</p>}
      />
    )

    expect(screen.getByText('Imagem do produto')).toBeInTheDocument()
    expect(screen.getByText('Escolhas do produto')).toBeInTheDocument()
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument()
  })

  it('keeps a back action available when the page has no media', () => {
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

    screen.getByRole('button').click()

    expect(onClose).toHaveBeenCalledOnce()
  })
})
