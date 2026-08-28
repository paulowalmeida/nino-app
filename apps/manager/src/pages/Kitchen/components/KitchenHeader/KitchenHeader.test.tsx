import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { useKitchenFacade } from '@pages/Kitchen/facades/useKitchenFacade/useKitchenFacade'
import { kitchenCardOrderMock } from '@shared/components/KitchenCard/KitchenCard.mock'

import { KitchenHeader } from './KitchenHeader'
import { kitchenHeaderMock } from './KitchenHeader.mock'

vi.mock('@pages/Kitchen/facades/useKitchenFacade/useKitchenFacade')

describe(KitchenHeader.name, () => {
  it('counts the open orders and how many are late', () => {
    vi.mocked(useKitchenFacade).mockReturnValue({
      orders: [kitchenCardOrderMock],
      isPending: false,
      isError: false,
    } as never)

    render(
      <KitchenHeader {...kitchenHeaderMock} onToggleCompact={() => undefined} />
    )

    expect(screen.getByText('em aberto')).toBeInTheDocument()
    expect(screen.getByText('atrasados')).toBeInTheDocument()
  })

  it('asks for the compact density and offers the way back', async () => {
    vi.mocked(useKitchenFacade).mockReturnValue({
      orders: [],
      isPending: false,
      isError: false,
    } as never)
    const onToggleCompact = vi.fn()
    const user = userEvent.setup()

    const { rerender } = render(
      <KitchenHeader isCompact={false} onToggleCompact={onToggleCompact} />
    )

    await user.click(screen.getByRole('button', { name: 'Compactar pedidos' }))
    expect(onToggleCompact).toHaveBeenCalled()

    rerender(<KitchenHeader isCompact onToggleCompact={onToggleCompact} />)
    expect(
      screen.getByRole('button', { name: 'Ver pedido inteiro' })
    ).toHaveAttribute('aria-pressed', 'true')
  })
})
