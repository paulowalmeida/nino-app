import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { FreeDeliveryControl } from './FreeDeliveryControl'

describe(FreeDeliveryControl.name, () => {
  it('keeps the minimum in place but locked while free delivery is off', async () => {
    const onEnabledChange = vi.fn()
    render(
      <FreeDeliveryControl
        enabled={false}
        minOrder=""
        onEnabledChange={onEnabledChange}
        onMinOrderChange={() => undefined}
      />
    )

    expect(
      screen.getByRole('textbox', { name: 'Grátis acima de (R$)' })
    ).toBeDisabled()

    await userEvent.click(
      screen.getByRole('checkbox', { name: 'Frete grátis' })
    )
    expect(onEnabledChange).toHaveBeenCalledWith(true)
  })

  it('masks the minimum as money once enabled', async () => {
    const onMinOrderChange = vi.fn()
    render(
      <FreeDeliveryControl
        enabled
        minOrder=""
        onEnabledChange={() => undefined}
        onMinOrderChange={onMinOrderChange}
      />
    )

    await userEvent.type(
      screen.getByRole('textbox', { name: 'Grátis acima de (R$)' }),
      '5'
    )
    expect(onMinOrderChange).toHaveBeenLastCalledWith('0,05')
  })
})
