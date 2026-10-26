import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'

import { PLACEHOLDER_NOTIFICATIONS } from '@shared/constants/notification-placeholder.constants'
import { useNotificationStore } from '@shared/states/notification/notification.state'

import { NotificationBell } from './NotificationBell'
import { notificationBellMock } from './NotificationBell.mock'

const renderBell = () =>
  render(
    <MemoryRouter>
      <NotificationBell {...notificationBellMock} />
    </MemoryRouter>
  )

describe('NotificationBell', () => {
  beforeEach(() => {
    useNotificationStore.setState({ notifications: PLACEHOLDER_NOTIFICATIONS })
  })

  it('announces the unread count and lists the latest ones', async () => {
    const user = userEvent.setup()
    renderBell()

    await user.click(
      screen.getByRole('button', { name: 'Notificações, 3 não lidas' })
    )

    expect(await screen.findByText('Pedido #1042 chegou')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Ver todas as notificações' })
    ).toHaveAttribute('href', '/unit-1/notificacoes')
  })

  it('clears the count when everything is marked as read', async () => {
    const user = userEvent.setup()
    renderBell()

    await user.click(screen.getByRole('button', { name: /Notificações/ }))
    await user.click(
      await screen.findByRole('button', { name: 'Marcar todas como lidas' })
    )

    expect(
      screen.getByRole('button', { name: 'Notificações' })
    ).toBeInTheDocument()
  })
})
