import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { BrandPalette } from './BrandPalette'
import { brandPaletteColorsMock } from './BrandPalette.mock'

describe(BrandPalette.name, () => {
  it('groups brand colors apart from surface and text colors', () => {
    render(<BrandPalette colors={brandPaletteColorsMock} onChange={vi.fn()} />)

    expect(screen.getByText('Marca')).toBeInTheDocument()
    expect(screen.getByText('Superfícies e texto')).toBeInTheDocument()
    expect(
      screen.getAllByRole('button', { name: /Escolher outra cor/ })
    ).toHaveLength(8)
  })

  it('reports the edited color under its own draft key', async () => {
    const onChange = vi.fn()
    render(<BrandPalette colors={brandPaletteColorsMock} onChange={onChange} />)

    fireEvent.click(screen.getByRole('button', { name: /Primária/ }))
    fireEvent.click(await screen.findByRole('button', { name: 'Aplicar' }))

    expect(onChange).toHaveBeenCalledWith({ primaryColor: '#FF6B00' })
  })
})
