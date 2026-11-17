import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { ProductImageLightbox } from './ProductImageLightbox'
import { productImageLightboxMock } from './ProductImageLightbox.mock'

describe('ProductImageLightbox', () => {
  it('stays closed without an image', () => {
    render(<ProductImageLightbox src={null} onClose={vi.fn()} />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('opens the image in a dialog', () => {
    render(
      <ProductImageLightbox
        src={productImageLightboxMock.src}
        onClose={vi.fn()}
      />
    )

    expect(
      screen.getByRole('dialog', { name: 'Imagem ampliada' })
    ).toBeInTheDocument()
  })

  it('names the product in the dark band under the image', () => {
    render(
      <ProductImageLightbox
        src={productImageLightboxMock.src}
        title={productImageLightboxMock.title}
        description={productImageLightboxMock.description}
        onClose={vi.fn()}
      />
    )

    expect(screen.getByText('X-Salada')).toBeInTheDocument()
    expect(
      screen.getByText(productImageLightboxMock.description)
    ).toBeInTheDocument()
  })

  it('closes when the image is clicked', async () => {
    const onClose = vi.fn()
    render(
      <ProductImageLightbox
        src={productImageLightboxMock.src}
        onClose={onClose}
      />
    )

    await userEvent.click(screen.getByRole('button', { name: 'Fechar imagem' }))

    expect(onClose).toHaveBeenCalledOnce()
  })

  it('closes with the X button', async () => {
    const onClose = vi.fn()
    render(
      <ProductImageLightbox
        src={productImageLightboxMock.src}
        onClose={onClose}
      />
    )

    await userEvent.click(screen.getByRole('button', { name: 'Fechar' }))

    expect(onClose).toHaveBeenCalledOnce()
  })
})
