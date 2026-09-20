import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { BrandHome } from './BrandHome'
import { homeDraftMock } from './BrandHome.mock'

const onChange = vi.fn()

describe(BrandHome.name, () => {
  beforeEach(() => onChange.mockClear())

  it('reflects which blocks are on the storefront', () => {
    render(<BrandHome home={homeDraftMock} onChange={onChange} />)

    expect(screen.getByLabelText('Banner')).toBeChecked()
    expect(screen.getByLabelText('Barra de categorias')).not.toBeChecked()
  })

  it('reports turning one block off without touching the others', async () => {
    render(<BrandHome home={homeDraftMock} onChange={onChange} />)

    await userEvent.click(screen.getByLabelText('Busca'))

    expect(onChange).toHaveBeenCalledWith({ showSearch: false })
  })

  it('reports turning a hidden block back on', async () => {
    render(<BrandHome home={homeDraftMock} onChange={onChange} />)

    await userEvent.click(screen.getByLabelText('Barra de categorias'))

    expect(onChange).toHaveBeenCalledWith({ showCategoryBar: true })
  })
})
