import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useUnitsFacade } from '@pages/Units/facades/useUnitsFacade/useUnitsFacade'

import { PersonalizeStudio } from './PersonalizeStudio'
import { personalizeStudioUnitMock } from './PersonalizeStudio.mock'

vi.mock('@pages/Units/facades/useUnitsFacade/useUnitsFacade', () => ({
  useUnitsFacade: vi.fn(),
}))

const save = vi.fn()

const facadeFor = (unit = personalizeStudioUnitMock) =>
  ({
    units: {
      detail: { data: unit, isPending: false, isError: false },
      save: { mutate: save, isPending: false },
    },
  }) as unknown as ReturnType<typeof useUnitsFacade>

describe(PersonalizeStudio.name, () => {
  beforeEach(() => {
    vi.mocked(useUnitsFacade).mockReturnValue(facadeFor())
    save.mockClear()
  })

  it('shows every editing section beside the consumer preview', () => {
    render(<PersonalizeStudio />)

    expect(
      screen.getByRole('region', { name: 'Ponto de partida' })
    ).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Cores' })).toBeInTheDocument()
    expect(
      screen.getByRole('region', { name: 'Logo e banner' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('region', { name: 'Prévia da loja para o cliente' })
    ).toBeInTheDocument()
  })

  it('keeps the publish bar hidden while nothing changed', () => {
    render(<PersonalizeStudio />)

    expect(screen.queryByText('Alterações ainda não publicadas')).toBeNull()
  })

  it('publishes the edited draft with the change applied', async () => {
    render(<PersonalizeStudio />)

    await userEvent.click(screen.getByLabelText('Pontos'))
    fireEvent.click(screen.getByRole('button', { name: 'Publicar na loja' }))

    expect(save).toHaveBeenCalledWith(
      expect.objectContaining({ loadingType: 'DOTS' })
    )
  })

  it('drops the pending edits when they are discarded', () => {
    render(<PersonalizeStudio />)

    fireEvent.click(screen.getByRole('button', { name: 'Meia-noite' }))
    expect(screen.getByText('Alterações ainda não publicadas')).toBeVisible()

    fireEvent.click(screen.getByRole('button', { name: 'Descartar' }))

    expect(screen.queryByText('Alterações ainda não publicadas')).toBeNull()
    expect(screen.getByRole('button', { name: 'Brasa' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
  })
})
