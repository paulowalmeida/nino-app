import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'

import type { MenuItem } from '@custom_types/menu/menu-item'
import { useStorefrontFacade } from '@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade'
import { ProductDetail } from './ProductDetail'
import { productDetailMock } from './ProductDetail.mock'

vi.mock('@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade')

describe('ProductDetail', () => {
  it('asks for confirmation before replacing another store cart', async () => {
    const replaceCart = vi.fn()
    let selectedItem: MenuItem | null = productDetailMock.item
    const setSelectedItem = vi.fn((item) => {
      selectedItem = item
    })
    vi.mocked(useStorefrontFacade).mockImplementation(
      () =>
        ({
          selectedItem,
          setSelectedItem,
          addToCart: vi.fn(() => false),
          replaceCart,
          isDesktop: true,
        }) as never
    )

    render(
      <MemoryRouter>
        <ProductDetail />
      </MemoryRouter>
    )
    fireEvent.click(screen.getByRole('button', { name: /Adicionar/ }))

    expect(
      await screen.findByText('Começar uma sacola nova?')
    ).toBeInTheDocument()
    expect(replaceCart).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: 'Trocar de loja' }))

    expect(replaceCart).toHaveBeenCalledWith(productDetailMock.item, 1)
    expect(setSelectedItem).toHaveBeenCalledWith(null)
  })
})
