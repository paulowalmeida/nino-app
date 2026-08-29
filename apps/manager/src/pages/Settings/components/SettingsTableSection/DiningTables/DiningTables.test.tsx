import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { DiningTables } from './DiningTables'

describe(DiningTables.name, () => {
  it('generates a batch using quantity and prefix', async () => {
    const onAdd = vi.fn()
    const user = userEvent.setup()

    render(
      <DiningTables
        tables={[]}
        tenantSlug="burgão-do-nino"
        isPending={false}
        isAdding={false}
        togglingId={undefined}
        onAdd={onAdd}
        onToggle={() => undefined}
      />
    )

    await user.click(screen.getByLabelText('Quantidade'))
    await user.keyboard('{Control>}a{/Control}12')
    await user.click(screen.getByRole('button', { name: 'Gerar mesas' }))

    expect(onAdd).toHaveBeenCalledWith({ quantity: 12, prefix: 'Mesa' })
  })
})
