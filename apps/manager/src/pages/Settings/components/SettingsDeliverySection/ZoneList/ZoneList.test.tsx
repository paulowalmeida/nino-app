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
        onRemove={() => undefined}
      />
    )
    expect(
      screen.getByText(
        /Adicione a primeira região para definir onde a loja atende/
      )
    ).toBeInTheDocument()
  })

  it('groups a region status, fee, and actions in the delivery list', () => {
    render(
      <ZoneList
        zones={[deliveryZoneMock]}
        isPending={false}
        onEdit={() => undefined}
        onToggle={() => undefined}
        onRemove={() => undefined}
      />
    )

    expect(screen.getByRole('button', { name: 'Centro' })).toBeInTheDocument()
    expect(screen.getByText('Faixas configuradas')).toBeInTheDocument()
    expect(screen.getByText('1 região')).toBeInTheDocument()
    expect(screen.getByText(/Atende pedidos/)).toBeInTheDocument()
    expect(screen.getByText(/R\$\s*7,00/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Editar' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Remover' })).toBeInTheDocument()
  })

  it('requests removal for the selected region', async () => {
    const onRemove = vi.fn()
    const user = userEvent.setup()

    render(
      <ZoneList
        zones={[deliveryZoneMock]}
        isPending={false}
        onEdit={() => undefined}
        onToggle={() => undefined}
        onRemove={onRemove}
      />
    )

    await user.click(screen.getByRole('button', { name: 'Remover' }))

    expect(onRemove).toHaveBeenCalledWith(deliveryZoneMock)
  })

  it('saves an edited region with a normalized fee', async () => {
    const onEdit = vi.fn()
    const user = userEvent.setup()

    render(
      <ZoneList
        zones={[deliveryZoneMock]}
        isPending={false}
        onEdit={onEdit}
        onToggle={() => undefined}
        onRemove={() => undefined}
      />
    )

    await user.click(screen.getByRole('button', { name: 'Editar' }))
    await user.clear(screen.getByLabelText('Nome da região'))
    await user.type(screen.getByLabelText('Nome da região'), 'Nazaré')
    await user.clear(screen.getByLabelText('Taxa da região'))
    await user.type(screen.getByLabelText('Taxa da região'), '8,50')
    await user.clear(screen.getByLabelText('Distância final'))
    await user.type(screen.getByLabelText('Distância final'), '6')
    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(onEdit).toHaveBeenCalledWith({
      id: deliveryZoneMock.id,
      name: 'Nazaré',
      minRadiusKm: 0,
      maxRadiusKm: 6,
      fee: 8.5,
    })
  })

  it('changes whether a region receives delivery orders', async () => {
    const onToggle = vi.fn()
    const user = userEvent.setup()

    render(
      <ZoneList
        zones={[deliveryZoneMock]}
        isPending={false}
        onEdit={() => undefined}
        onToggle={onToggle}
        onRemove={() => undefined}
      />
    )

    await user.click(screen.getByRole('checkbox', { name: 'Centro atendido' }))

    expect(onToggle).toHaveBeenCalledWith({
      id: deliveryZoneMock.id,
      isActive: false,
    })
  })
})
