import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useUnitsFacade } from '@pages/Units/facades/useUnitsFacade/useUnitsFacade'

import { PersonalizeStudio } from './PersonalizeStudio'
import {
  personalizeStudioUnitMock,
  themeEditorStateMock,
} from './PersonalizeStudio.mock'

vi.mock('@pages/Units/facades/useUnitsFacade/useUnitsFacade', () => ({
  useUnitsFacade: vi.fn(),
}))

const save = vi.fn()
const saveDraft = vi.fn()
const publish = vi.fn()

const facadeFor = (unit = personalizeStudioUnitMock) =>
  ({
    units: {
      detail: { data: unit, isPending: false, isError: false },
      save: { mutate: save, isPending: false },
    },
    theme: {
      editor: { data: themeEditorStateMock },
      saveDraft: { mutate: saveDraft, isPending: false },
      publish: { mutate: publish, isPending: false },
      restore: { mutate: vi.fn(), isPending: false },
    },
  }) as unknown as ReturnType<typeof useUnitsFacade>

describe(PersonalizeStudio.name, () => {
  beforeEach(() => {
    vi.mocked(useUnitsFacade).mockReturnValue(facadeFor())
    save.mockClear()
    saveDraft.mockClear()
    publish.mockClear()
  })

  it('opens on the starting point, beside the consumer preview', () => {
    render(<PersonalizeStudio />)

    expect(
      screen.getByRole('region', { name: 'Ponto de partida' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('region', { name: 'Prévia da loja para o cliente' })
    ).toBeInTheDocument()
    expect(screen.queryByRole('region', { name: 'Cores' })).toBeNull()
  })

  it('swaps the panel for the part chosen in the tree', async () => {
    render(<PersonalizeStudio />)

    await userEvent.click(screen.getByRole('tab', { name: 'Acompanhamento' }))

    expect(
      screen.getByRole('region', { name: 'Acompanhamento' })
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('region', { name: 'Ponto de partida' })
    ).toBeNull()
  })

  it('keeps the publish bar hidden while nothing changed', () => {
    render(<PersonalizeStudio />)

    expect(screen.queryByText('Alterações ainda não salvas')).toBeNull()
  })

  it('saves the edited draft without putting it on the storefront', async () => {
    render(<PersonalizeStudio />)

    await userEvent.click(screen.getByRole('tab', { name: 'Carregamento' }))
    await userEvent.click(screen.getByLabelText('Pontos'))
    fireEvent.click(screen.getByRole('button', { name: 'Salvar rascunho' }))

    expect(saveDraft).toHaveBeenCalledWith(
      expect.objectContaining({
        draft: expect.objectContaining({ loadingType: 'DOTS' }),
      })
    )
    expect(publish).not.toHaveBeenCalled()
  })

  it('publishes the edited draft with the change applied', async () => {
    render(<PersonalizeStudio />)

    await userEvent.click(screen.getByRole('tab', { name: 'Carregamento' }))
    await userEvent.click(screen.getByLabelText('Pontos'))
    fireEvent.click(screen.getByRole('button', { name: 'Publicar na loja' }))

    expect(publish).toHaveBeenCalledWith(
      expect.objectContaining({
        draft: expect.objectContaining({ loadingType: 'DOTS' }),
      })
    )
  })

  it('drops the pending edits when they are discarded', () => {
    render(<PersonalizeStudio />)

    fireEvent.click(screen.getByRole('button', { name: 'Meia-noite' }))
    expect(screen.getByText('Alterações ainda não salvas')).toBeVisible()

    fireEvent.click(screen.getByRole('button', { name: 'Descartar' }))

    expect(screen.queryByText('Alterações ainda não salvas')).toBeNull()
    expect(screen.getByRole('button', { name: 'Brasa' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
  })
})
