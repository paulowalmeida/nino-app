import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { PLACEHOLDER_NOTIFICATIONS } from '@shared/constants/notification-placeholder.constants'
import { useNotificationStore } from '@shared/states/notification/notification.state'

import { Notifications } from './Notifications'

vi.mock('@shared/hooks/session/useCurrentUnit/useCurrentUnit', () => ({
  useCurrentUnit: () => ({ unitId: 'unit-1' }),
}))

describe('Notifications', () => {
  beforeEach(() => {
    useNotificationStore.setState({ notifications: PLACEHOLDER_NOTIFICATIONS })
  })

  it('opens on the unread ones and empties them on demand', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <Notifications />
      </MemoryRouter>
    )

    expect(screen.getAllByText('Pedido #1042 chegou').length).toBeGreaterThan(0)

    await user.click(
      screen.getByRole('button', { name: 'Marcar todas como lidas' })
    )

    expect(screen.getByText('Tudo em dia')).toBeInTheDocument()
  })
})
