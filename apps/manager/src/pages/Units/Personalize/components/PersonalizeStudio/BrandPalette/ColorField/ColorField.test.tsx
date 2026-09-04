import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ColorField } from './ColorField'
import { colorFieldMock } from './ColorField.mock'

describe(ColorField.name, () => {
  it('shows the label, the hint and the current hex', () => {
    render(<ColorField {...colorFieldMock} onValueChange={vi.fn()} />)

    expect(screen.getByText('Cor primária')).toBeInTheDocument()
    expect(screen.getByText('Botões, preços e destaques')).toBeInTheDocument()
    expect(screen.getByText('#FF6B00')).toBeInTheDocument()
  })

  it('opens the picker without committing a color until it is applied', async () => {
    const onValueChange = vi.fn()
    render(<ColorField {...colorFieldMock} onValueChange={onValueChange} />)

    fireEvent.click(screen.getByRole('button', { name: /Cor primária/ }))

    expect(await screen.findByRole('dialog')).toBeInTheDocument()
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('keeps the current color when the picker is dismissed', async () => {
    const onValueChange = vi.fn()
    render(<ColorField {...colorFieldMock} onValueChange={onValueChange} />)

    fireEvent.click(screen.getByRole('button', { name: /Cor primária/ }))
    fireEvent.click(await screen.findByRole('button', { name: 'Cancelar' }))

    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('commits the picked color when it is applied', async () => {
    const onValueChange = vi.fn()
    render(<ColorField {...colorFieldMock} onValueChange={onValueChange} />)

    fireEvent.click(screen.getByRole('button', { name: /Cor primária/ }))
    fireEvent.click(await screen.findByRole('button', { name: 'Aplicar' }))

    expect(onValueChange).toHaveBeenCalledWith(colorFieldMock.value)
  })
})
