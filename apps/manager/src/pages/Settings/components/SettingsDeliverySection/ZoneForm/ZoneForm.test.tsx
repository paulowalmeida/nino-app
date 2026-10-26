import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { ZoneForm } from './ZoneForm'
import { zoneFormMock } from './ZoneForm.mock'

describe('ZoneForm', () => {
  it('adds a delivery range', async () => {
    const onAdd = vi.fn()
    const user = userEvent.setup()

    render(<ZoneForm {...zoneFormMock} onAdd={onAdd} />)

    expect(
      screen.getByRole('button', { name: 'Adicionar faixa' })
    ).toBeDisabled()

    await user.type(screen.getByLabelText('Até (km)'), '5')
    await user.type(screen.getByLabelText('Taxa de entrega (R$)'), '7,50')
    expect(
      screen.getByRole('button', { name: 'Adicionar faixa' })
    ).toBeEnabled()
    await user.click(screen.getByRole('button', { name: 'Adicionar faixa' }))

    expect(onAdd).toHaveBeenCalledWith({
      maxRadiusKm: 5,
      fee: 7.5,
      freeDeliveryEnabled: false,
      freeDeliveryMinOrder: null,
    })
  })

  it('adds the range with free delivery above a minimum', async () => {
    const onAdd = vi.fn()
    const user = userEvent.setup()

    render(<ZoneForm {...zoneFormMock} onAdd={onAdd} />)

    await user.type(screen.getByLabelText('Até (km)'), '5')
    await user.type(screen.getByLabelText('Taxa de entrega (R$)'), '7,50')
    await user.click(
      screen.getByRole('checkbox', { name: 'Frete grátis' })
    )
    await user.type(screen.getByLabelText('Grátis acima de (R$)'), '5000')
    await user.click(screen.getByRole('button', { name: 'Adicionar faixa' }))

    expect(onAdd).toHaveBeenCalledWith(
      expect.objectContaining({
        freeDeliveryEnabled: true,
        freeDeliveryMinOrder: 50,
      })
    )
  })

  it('previews the radius while the range is typed', async () => {
    const onPreviewRadius = vi.fn()
    const user = userEvent.setup()

    render(
      <ZoneForm
        {...zoneFormMock}
        onAdd={vi.fn()}
        onPreviewRadius={onPreviewRadius}
      />
    )

    await user.type(screen.getByLabelText('Até (km)'), '5')

    expect(onPreviewRadius).toHaveBeenLastCalledWith(5)
  })
})
