import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useUnitsFacade } from '@pages/Units/facades/useUnitsFacade/useUnitsFacade'
import type { ThemeEditorState } from '@pages/Units/types/ThemeEditorState.type'

import { BrandHistory } from './BrandHistory'
import {
  emptyEditorStateMock,
  historyEditorStateMock,
} from './BrandHistory.mock'

vi.mock('@pages/Units/facades/useUnitsFacade/useUnitsFacade', () => ({
  useUnitsFacade: vi.fn(),
}))

const restore = vi.fn()

const facadeFor = (
  editorState: ThemeEditorState,
  isRestoring = false
) =>
  ({
    theme: {
      editor: { data: editorState },
      restore: { mutate: restore, isPending: isRestoring },
    },
  }) as unknown as ReturnType<typeof useUnitsFacade>

describe(BrandHistory.name, () => {
  beforeEach(() => {
    restore.mockClear()
    vi.mocked(useUnitsFacade).mockReturnValue(facadeFor(historyEditorStateMock))
  })

  it('marks which version is on the storefront right now', () => {
    render(<BrandHistory />)

    expect(screen.getByText('Versão 3 · no ar')).toBeVisible()
    expect(screen.getByText('Versão 2')).toBeVisible()
  })

  it('invites the first publication when no version exists yet', () => {
    vi.mocked(useUnitsFacade).mockReturnValue(facadeFor(emptyEditorStateMock))

    render(<BrandHistory />)

    expect(
      screen.getByText(
        'As versões aparecem aqui depois da primeira publicação.'
      )
    ).toBeVisible()
    expect(screen.queryByRole('button', { name: 'Restaurar' })).toBeNull()
  })

  it('confirms before putting an old version back on the air', async () => {
    render(<BrandHistory />)

    await userEvent.click(
      screen.getAllByRole('button', { name: 'Restaurar' })[0]
    )

    expect(screen.getByText('Restaurar a versão 2?')).toBeVisible()
    expect(restore).not.toHaveBeenCalled()
  })

  it('restores the confirmed version', async () => {
    render(<BrandHistory />)

    await userEvent.click(
      screen.getAllByRole('button', { name: 'Restaurar' })[0]
    )
    const dialog = screen.getByRole('dialog')
    await userEvent.click(
      within(dialog).getByRole('button', { name: 'Restaurar' })
    )

    expect(restore).toHaveBeenCalledWith(2)
  })

  it('blocks a second restore while one is running', () => {
    vi.mocked(useUnitsFacade).mockReturnValue(
      facadeFor(historyEditorStateMock, true)
    )

    render(<BrandHistory />)

    expect(
      screen.getAllByRole('button', { name: 'Restaurar' })[0]
    ).toBeDisabled()
  })
})
