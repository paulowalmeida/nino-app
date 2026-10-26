import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { NotificationItem } from './NotificationItem'
import { unreadNotificationMock } from './NotificationItem.mock'

describe('NotificationItem', () => {
  it('opens the screen it refers to and reports the read', async () => {
    const user = userEvent.setup()
    const onOpen = vi.fn()

    render(
      <MemoryRouter>
        <NotificationItem
          notification={unreadNotificationMock}
          unitId="unit-1"
          onOpen={onOpen}
        />
      </MemoryRouter>
    )

    const link = screen.getByRole('link', { name: /Pedido #1042 chegou/ })
    expect(link).toHaveAttribute('href', '/unit-1/pedidos')
    expect(screen.getByText('Não lida')).toBeInTheDocument()

    await user.click(link)
    expect(onOpen).toHaveBeenCalledWith('ntf-1')
  })
})
