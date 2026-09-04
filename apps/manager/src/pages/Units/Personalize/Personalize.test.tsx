
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useUnitsFacade } from '@pages/Units/facades/useUnitsFacade/useUnitsFacade'

import { Personalize } from './Personalize'
import { personalizeUnitMock } from './Personalize.mock'

vi.mock('@pages/Units/facades/useUnitsFacade/useUnitsFacade', () => ({
  useUnitsFacade: vi.fn(),
}))

const facadeWith = (detail: Record<string, unknown>) =>
  ({
    units: { detail, save: { mutate: vi.fn(), isPending: false } },
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
