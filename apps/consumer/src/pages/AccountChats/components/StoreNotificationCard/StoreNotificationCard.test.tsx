import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { StoreNotificationCard } from './StoreNotificationCard'
import { storeNotificationCardMock } from './StoreNotificationCard.mock'

describe('StoreNotificationCard', () => {
  it('renders the title, body and unread flag for a fresh notification', () => {
    // Arrange
    const onSeen = vi.fn()

    // Act
    render(
      <StoreNotificationCard
        notification={storeNotificationCardMock.unread}
        onSeen={onSeen}
      />
    )

    // Assert
    expect(
      screen.getByRole('heading', { name: 'Cupom novo na loja' })
    ).toBeInTheDocument()
    expect(screen.getByText('Nova')).toBeInTheDocument()
    expect(onSeen).toHaveBeenCalledWith('notification-1')
  })

  it('does not flag or re-report an already-read notification', () => {
    // Arrange
    const onSeen = vi.fn()

    // Act
    render(
      <StoreNotificationCard
        notification={storeNotificationCardMock.read}
        onSeen={onSeen}
      />
    )

    // Assert
    expect(screen.queryByText('Nova')).not.toBeInTheDocument()
    expect(onSeen).not.toHaveBeenCalled()
  })
})
