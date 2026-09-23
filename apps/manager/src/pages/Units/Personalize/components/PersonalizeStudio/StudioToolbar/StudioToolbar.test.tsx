import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { StudioToolbar } from './StudioToolbar'
import { studioToolbarPropsMock } from './StudioToolbar.mock'

const handlers = {
  onSave: vi.fn(),
  onPublish: vi.fn(),
  onDiscard: vi.fn(),
}

const renderToolbar = (props: Partial<typeof studioToolbarPropsMock> = {}) =>
  render(<StudioToolbar {...studioToolbarPropsMock} {...props} {...handlers} />)

describe(StudioToolbar.name, () => {
  beforeEach(() => {
    Object.values(handlers).forEach((handler) => handler.mockClear())
  })

  it('states which version the customer is seeing', () => {
    renderToolbar()

    expect(screen.getByText('No ar: versão 4')).toBeVisible()
  })

  it('separates unsaved edits from a stored draft', () => {
    renderToolbar({ isDirty: true })
    expect(screen.getByText('Alterações ainda não salvas')).toBeVisible()

    renderToolbar({ hasUnpublishedDraft: true })
    expect(
      screen.getByText('Rascunho salvo, ainda não publicado')
    ).toBeVisible()
  })

  it('keeps saving out of reach while nothing changed', () => {
    renderToolbar()

    expect(
      screen.getByRole('button', { name: 'Salvar rascunho' })
    ).toBeDisabled()
    expect(screen.queryByRole('button', { name: 'Descartar' })).toBeNull()
  })

  it('offers publishing a draft that was already stored', () => {
    renderToolbar({ hasUnpublishedDraft: true })

    expect(
      screen.getByRole('button', { name: 'Publicar na loja' })
    ).toBeEnabled()
  })

  it('asks to discard only when there is something to lose', async () => {
    renderToolbar({ isDirty: true })

    await userEvent.click(screen.getByRole('button', { name: 'Descartar' }))

    expect(handlers.onDiscard).toHaveBeenCalled()
  })
})
