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
const loadVersion = vi.fn()

const facadeFor = (editorState: ThemeEditorState, isRestoring = false) =>
  ({
    theme: {
      editor: { data: editorState },
      restore: { mutate: restore, isPending: isRestoring },
    },
  }) as unknown as ReturnType<typeof useUnitsFacade>

describe(BrandHistory.name, () => {
  beforeEach(() => {
    restore.mockClear()
    loadVersion.mockClear()
    vi.mocked(useUnitsFacade).mockReturnValue(facadeFor(historyEditorStateMock))
  })

  it('shows the published version selected by default, with no restore', () => {
    render(<BrandHistory onLoadVersion={loadVersion} />)

    expect(
      screen.getByRole('combobox', { name: 'Configuração para editar' })
    ).toHaveTextContent('Versão 3 · no ar')
    expect(screen.queryByRole('button', { name: 'Restaurar' })).toBeNull()
  })

  it('offers restore only for a selected past version', async () => {
    render(<BrandHistory onLoadVersion={loadVersion} />)

    await userEvent.click(
      screen.getByRole('combobox', { name: 'Configuração para editar' })
    )
    await userEvent.click(screen.getByRole('option', { name: 'Versão 2' }))

    expect(
      screen.getByRole('button', { name: 'Restaurar' })
    ).toBeInTheDocument()
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
    render(<BrandHistory onLoadVersion={loadVersion} />)

    // Act: select the past version, then trigger restore
    await userEvent.click(
      screen.getByRole('combobox', { name: 'Configuração para editar' })
    )
    await userEvent.click(screen.getByRole('option', { name: 'Versão 2' }))
    await userEvent.click(screen.getByRole('button', { name: 'Restaurar' }))

    expect(screen.getByText('Restaurar a versão 2?')).toBeVisible()
    expect(restore).not.toHaveBeenCalled()
  })

  it('restores the confirmed version', async () => {
    render(<BrandHistory onLoadVersion={loadVersion} />)

    // Act: select the past version, confirm the restore dialog
    await userEvent.click(
      screen.getByRole('combobox', { name: 'Configuração para editar' })
    )
    await userEvent.click(screen.getByRole('option', { name: 'Versão 2' }))
    await userEvent.click(screen.getByRole('button', { name: 'Restaurar' }))
    const dialog = screen.getByRole('dialog')
    await userEvent.click(
      within(dialog).getByRole('button', { name: 'Restaurar' })
    )

    expect(restore).toHaveBeenCalledWith(2)
  })

  it('blocks a second restore while one is running', async () => {
    vi.mocked(useUnitsFacade).mockReturnValue(
      facadeFor(historyEditorStateMock, true)
    )

    render(<BrandHistory onLoadVersion={loadVersion} />)
    await userEvent.click(
      screen.getByRole('combobox', { name: 'Configuração para editar' })
    )
    await userEvent.click(screen.getByRole('option', { name: 'Versão 2' }))

    expect(screen.getByRole('button', { name: 'Restaurar' })).toBeDisabled()
  })

  it('loads a saved configuration from the selector', async () => {
    render(<BrandHistory onLoadVersion={loadVersion} />)

    await userEvent.click(
      screen.getByRole('combobox', { name: 'Configuração para editar' })
    )
    await userEvent.click(screen.getByRole('option', { name: 'Versão 2' }))

    expect(loadVersion).toHaveBeenCalledWith(historyEditorStateMock.history[0])
  })
})
