import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { ZoneList } from './ZoneList'
import { deliveryZoneMock } from './ZoneList.mock'

describe('ZoneList', () => {
  it('shows the empty state', () => {
    render(
      <ZoneList
        zones={[]}
        isPending={false}
        onEdit={() => undefined}
        onToggle={() => undefined}
        onFreeDeliveryChange={() => undefined}
        onRemove={() => undefined}
      />
    )
    expect(
      screen.getByText(
        /Adicione a primeira faixa para definir onde a loja atende/
      )
    ).toBeInTheDocument()
  })

  it('shows a range status, fee, and actions in the delivery list', () => {
    render(
      <ZoneList
        zones={[deliveryZoneMock]}
        isPending={false}
        onEdit={() => undefined}
        onToggle={() => undefined}
        onFreeDeliveryChange={() => undefined}
        onRemove={() => undefined}
      />
    )

    expect(screen.getByText('Faixas configuradas')).toBeInTheDocument()
    expect(screen.getByText(/R\$\s*7,00/)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Editar Taxa da faixa 0–5 km' })
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Remover' })).toBeInTheDocument()
    expect(
      screen.getByRole('button', {
        name: 'Mais ações para a faixa de 0 a 5 km',
      })
    ).toBeInTheDocument()
  })

  it('requests removal for the selected range', async () => {
    const onRemove = vi.fn()
    const user = userEvent.setup()

    render(
      <ZoneList
        zones={[deliveryZoneMock]}
        isPending={false}
        onEdit={() => undefined}
        onToggle={() => undefined}
        onFreeDeliveryChange={() => undefined}
        onRemove={onRemove}
      />
    )

    await user.click(screen.getByRole('button', { name: 'Remover' }))

    expect(onRemove).toHaveBeenCalledWith(deliveryZoneMock)
  })

  it('edits the fee in place and saves it as money', async () => {
    const onEdit = vi.fn()
    const user = userEvent.setup()

    render(
      <ZoneList
        zones={[deliveryZoneMock]}
        isPending={false}
        onEdit={onEdit}
        onToggle={() => undefined}
        onFreeDeliveryChange={() => undefined}
        onRemove={() => undefined}
      />
    )

    await user.click(
      screen.getByRole('button', { name: 'Editar Taxa da faixa 0–5 km' })
    )
    const fee = screen.getByRole('textbox', { name: 'Taxa da faixa 0–5 km' })
    await user.clear(fee)
    await user.type(fee, '850')
    await user.tab()

    expect(onEdit).toHaveBeenCalledWith({ id: deliveryZoneMock.id, fee: 8.5 })
  })

  it('changes whether a range receives delivery orders', async () => {
    const onToggle = vi.fn()
    const user = userEvent.setup()

    render(
      <ZoneList
        zones={[deliveryZoneMock]}
        isPending={false}
        onEdit={() => undefined}
        onToggle={onToggle}
        onFreeDeliveryChange={() => undefined}
        onRemove={() => undefined}
      />
    )

    await user.click(
      screen.getByRole('checkbox', { name: 'Faixa de até 5 km atendida' })
    )

    expect(onToggle).toHaveBeenCalledWith({
      id: deliveryZoneMock.id,
      isActive: false,
    })
  })

  it('turns free delivery on and saves the minimum when the field loses focus', async () => {
    const onFreeDeliveryChange = vi.fn()
    const user = userEvent.setup()
    const { rerender } = render(
      <ZoneList
        zones={[deliveryZoneMock]}
        isPending={false}
        onEdit={() => undefined}
        onToggle={() => undefined}
        onFreeDeliveryChange={onFreeDeliveryChange}
        onRemove={() => undefined}
      />
    )

    await user.click(
      screen.getByRole('checkbox', {
        name: 'Frete grátis na faixa de até 5 km',
      })
    )
    expect(onFreeDeliveryChange).toHaveBeenCalledWith({
      id: deliveryZoneMock.id,
      freeDeliveryEnabled: true,
    })

    rerender(
      <ZoneList
        zones={[{ ...deliveryZoneMock, freeDeliveryEnabled: true }]}
        isPending={false}
        onEdit={() => undefined}
        onToggle={() => undefined}
        onFreeDeliveryChange={onFreeDeliveryChange}
        onRemove={() => undefined}
      />
    )
    const minimum = screen.getByRole('textbox', {
      name: 'Frete grátis acima de, faixa até 5 km',
    })
    expect(minimum).toHaveAttribute('placeholder', 'Qualquer valor')

    await user.type(minimum, '4000')
    await user.tab()
    expect(onFreeDeliveryChange).toHaveBeenLastCalledWith({
      id: deliveryZoneMock.id,
      freeDeliveryMinOrder: 40,
    })
  })

  it('edits the range in place, saves on blur and focuses it on the map', async () => {
    const onEdit = vi.fn()
    const onFocusZone = vi.fn()
    const user = userEvent.setup()

    render(
      <ZoneList
        zones={[deliveryZoneMock]}
        isPending={false}
        onEdit={onEdit}
        onToggle={() => undefined}
        onFreeDeliveryChange={() => undefined}
        onRemove={() => undefined}
        onFocusZone={onFocusZone}
      />
    )

    await user.click(
      screen.getByRole('button', { name: 'Editar Até (km) da faixa 0–5 km' })
    )
    expect(onFocusZone).toHaveBeenCalledWith(deliveryZoneMock.id)

    const radius = screen.getByRole('textbox', {
      name: 'Até (km) da faixa 0–5 km',
    })
    await user.clear(radius)
    await user.type(radius, '6')
    await user.tab()

    expect(onEdit).toHaveBeenCalledWith({
      id: deliveryZoneMock.id,
      maxRadiusKm: 6,
    })
  })
})
