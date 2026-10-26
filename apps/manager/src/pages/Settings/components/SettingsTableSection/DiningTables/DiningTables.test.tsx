import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import type { DiningTable } from '@shared/types/settings/dining-table'

import { DiningTables } from './DiningTables'

describe(DiningTables.name, () => {
  it('generates a batch using quantity and prefix', async () => {
    const onAdd = vi.fn()
    const user = userEvent.setup()

    render(
      <DiningTables
        tables={[]}
        unitSlug="burgão-do-nino"
        isPending={false}
        isAdding={false}
        togglingId={undefined}
        onAdd={onAdd}
        onToggle={() => undefined}
        onRemove={() => undefined}
      />
    )

    await user.click(screen.getByLabelText('Quantidade'))
    await user.keyboard('{Control>}a{/Control}12')
    await user.click(screen.getByRole('button', { name: 'Gerar mesas' }))

    expect(onAdd).toHaveBeenCalledWith({ quantity: 12, prefix: 'Mesa' })
  })

  it('opens the table QR Code in a modal', async () => {
    const user = userEvent.setup()
    const table: DiningTable = {
      id: 'table-1',
      unitId: 'unit-1',
      name: 'Mesa 1',
      publicKey: 'public-key-1',
      isActive: true,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    }

    render(
      <DiningTables
        tables={[table]}
        unitSlug="burgão-do-nino"
        isPending={false}
        isAdding={false}
        onAdd={() => undefined}
        onToggle={() => undefined}
        onRemove={() => undefined}
      />
    )

    await user.click(
      screen.getByRole('button', { name: 'Ver QR Code da Mesa 1' })
    )

    expect(
      screen.getByRole('heading', { name: 'QR Code da Mesa 1' })
    ).toBeInTheDocument()
  })
  it('keeps the page interactive after removing a table', async () => {
    const onRemove = vi.fn()
    const user = userEvent.setup()
    const table: DiningTable = {
      id: 'table-1',
      unitId: 'unit-1',
      name: 'Mesa 1',
      publicKey: 'public-key-1',
      isActive: true,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    }

    render(
      <DiningTables
        tables={[table]}
        unitSlug="burgão-do-nino"
        isPending={false}
        isAdding={false}
        onAdd={() => undefined}
        onToggle={() => undefined}
        onRemove={onRemove}
      />
    )

    await user.click(screen.getByRole('button', { name: 'Remover' }))
    await user.click(screen.getByRole('button', { name: 'Remover mesa' }))

    expect(onRemove).toHaveBeenCalledWith('table-1')
    await waitFor(() => {
      expect(document.body.style.pointerEvents).not.toBe('none')
    })
  })
})
