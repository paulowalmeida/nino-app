import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { BrandCatalog } from './BrandCatalog'
import { catalogDraftMock } from './BrandCatalog.mock'

const onChange = vi.fn()

describe(BrandCatalog.name, () => {
  beforeEach(() => onChange.mockClear())

  it('shows the presentation currently chosen', () => {
    render(<BrandCatalog catalog={catalogDraftMock} onChange={onChange} />)

    expect(
      screen.getByRole('combobox', { name: 'Estilo do item' })
    ).toHaveTextContent('Imagem lateral')
    expect(screen.getByLabelText('Mostrar descrição')).toBeChecked()
  })

  it('reports a hidden description without touching the rest', async () => {
    render(<BrandCatalog catalog={catalogDraftMock} onChange={onChange} />)

    await userEvent.click(screen.getByLabelText('Mostrar descrição'))

    expect(onChange).toHaveBeenCalledWith({ showDescription: false })
  })

  it('offers every item style the storefront can render', async () => {
    render(<BrandCatalog catalog={catalogDraftMock} onChange={onChange} />)

    await userEvent.click(
      screen.getByRole('combobox', { name: 'Estilo do item' })
    )

    expect(screen.getByRole('option', { name: 'Só texto' })).toBeVisible()
  })
})
