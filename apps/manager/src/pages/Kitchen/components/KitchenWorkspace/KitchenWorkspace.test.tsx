import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { KitchenWorkspace } from './KitchenWorkspace'
import { kitchenWorkspaceMock } from './KitchenWorkspace.mock'

vi.mock('@pages/Kitchen/components/KitchenHeader/KitchenHeader', () => ({
  KitchenHeader: ({
    isCompact,
    onToggleCompact,
  }: {
    isCompact: boolean
    onToggleCompact: () => void
  }) => (
    <button type="button" onClick={onToggleCompact}>
      {isCompact ? 'Ver pedido inteiro' : kitchenWorkspaceMock.compactLabel}
    </button>
  ),
}))
vi.mock('@pages/Kitchen/components/KitchenBoard/KitchenBoard', () => ({
  KitchenBoard: ({ isCompact }: { isCompact: boolean }) => (
    <div>{isCompact ? 'compact board' : 'kitchen board'}</div>
  ),
}))

describe(KitchenWorkspace.name, () => {
  it('keeps the display density local to the kitchen workspace', async () => {
    const user = userEvent.setup()

    render(<KitchenWorkspace />)

    expect(screen.getByText('kitchen board')).toBeInTheDocument()
    await user.click(
      screen.getByRole('button', { name: kitchenWorkspaceMock.compactLabel })
    )
    expect(screen.getByText('compact board')).toBeInTheDocument()
  })
})
