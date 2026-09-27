
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useUnitsFacade } from '@pages/Units/facades/useUnitsFacade/useUnitsFacade'

import { Personalize } from './Personalize'
import { personalizeUnitMock } from './Personalize.mock'

vi.mock('@pages/Units/facades/useUnitsFacade/useUnitsFacade', () => ({
  useUnitsFacade: vi.fn(),
}))

const facadeWith = (
  detail: Record<string, unknown>,
  editor: Record<string, unknown> = {
    data: { published: null, draft: null, history: [] },
    isPending: false,
    isError: false,
  }
) =>
  ({
    units: { detail, save: { mutate: vi.fn(), isPending: false } },
    theme: {
      editor,
      saveDraft: { mutate: vi.fn(), isPending: false },
      publish: { mutate: vi.fn(), isPending: false },
      restore: { mutate: vi.fn(), isPending: false },
    },
  }) as unknown as ReturnType<typeof useUnitsFacade>

const renderPage = () => render(<Personalize />)

describe(Personalize.name, () => {
  beforeEach(() => vi.mocked(useUnitsFacade).mockReset())

  it('holds the loading screen until the unit arrives', () => {
    vi.mocked(useUnitsFacade).mockReturnValue(
      facadeWith({ data: undefined, isPending: true, isError: false })
    )

    renderPage()

    expect(screen.getByRole('status')).toHaveTextContent(
      'Carregando a personalização da loja'
    )
  })

  it('keeps the skeleton while the API response is incomplete', () => {
    vi.mocked(useUnitsFacade).mockReturnValue(
      facadeWith({ data: undefined, isPending: false, isError: false })
    )

    renderPage()

    expect(screen.getByRole('status')).toHaveTextContent(
      'Carregando a personalização da loja'
    )
  })

  it('shows an error when the theme request fails', () => {
    vi.mocked(useUnitsFacade).mockReturnValue(
      facadeWith(
        { data: personalizeUnitMock, isPending: false, isError: false },
        { data: undefined, isPending: false, isError: true }
      )
    )

    renderPage()

    expect(screen.getByText('A personalização não carregou')).toBeVisible()
    expect(
      screen.getByText(/A API não retornou todos os dados necessários/)
    ).toBeVisible()
  })

  it('explains when loading timed out', () => {
    vi.mocked(useUnitsFacade).mockReturnValue(
      facadeWith(
        { data: undefined, isPending: false, isError: true, error: new Error('Request timed out') }
      )
    )

    renderPage()

    expect(screen.getByRole('alert')).toHaveTextContent(
      'A requisição excedeu o tempo limite'
    )
  })

  it('explains the failure instead of showing an empty studio', () => {
    vi.mocked(useUnitsFacade).mockReturnValue(
      facadeWith({ data: undefined, isPending: false, isError: true })
    )

    renderPage()

    expect(screen.getByText('A personalização não carregou')).toBeVisible()
    expect(
      screen.queryByRole('region', { name: 'Prévia da loja para o cliente' })
    ).toBeNull()
  })

  it('opens the studio for the loaded unit', () => {
    vi.mocked(useUnitsFacade).mockReturnValue(
      facadeWith({
        data: personalizeUnitMock,
        isPending: false,
        isError: false,
      })
    )

    renderPage()

    expect(
      screen.getByRole('heading', { level: 1, name: 'Personalizar loja' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('region', { name: 'Prévia da loja para o cliente' })
    ).toBeInTheDocument()
  })
})
