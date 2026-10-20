import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { usePositionDetailFacade } from '@pages/PositionDetail/facades/usePositionDetailFacade/usePositionDetailFacade'

import { PositionDetail } from './PositionDetail'
import { positionDetailPositionMock } from './PositionDetail.mock'

vi.mock('@pages/PositionDetail/facades/usePositionDetailFacade/usePositionDetailFacade')
vi.mock('@pages/PositionDetail/components/PositionDetailHeader/PositionDetailHeader', () => ({
  PositionDetailHeader: () => <div>header</div>,
}))
vi.mock('@pages/PositionDetail/components/PositionDetailForm/PositionDetailForm', () => ({
  PositionDetailForm: () => <div>form</div>,
}))
vi.mock('@pages/PositionDetail/skeletons/PositionDetailSkeleton/PositionDetailSkeleton', () => ({
  PositionDetailSkeleton: () => <div>skeleton</div>,
}))

const givenFacade = (state: object) =>
  vi.mocked(usePositionDetailFacade).mockReturnValue({
    isCreating: false,
    position: positionDetailPositionMock,
    isPending: false,
    isError: false,
    ...state,
  } as never)

const renderPage = () =>
  render(
    <MemoryRouter>
      <PositionDetail />
    </MemoryRouter>
  )

describe(PositionDetail.name, () => {
  beforeEach(() => vi.clearAllMocks())

  it('shows the skeleton while the cargos load', () => {
    givenFacade({ isPending: true })

    renderPage()

    expect(screen.getByText('skeleton')).toBeInTheDocument()
  })

  it('explains a failed load', () => {
    givenFacade({ isError: true })

    renderPage()

    expect(screen.getByText('Não foi possível carregar o cargo')).toBeVisible()
  })

  it('tells when the cargo no longer exists', () => {
    givenFacade({ position: undefined })

    renderPage()

    expect(
      screen.getByText('Este cargo não existe mais nesta loja.')
    ).toBeVisible()
  })

  it('composes the header and the form for an existing cargo', () => {
    givenFacade({})

    renderPage()

    expect(screen.getByText('header')).toBeInTheDocument()
    expect(screen.getByText('form')).toBeInTheDocument()
  })

  it('composes the header and the form for a new cargo', () => {
    givenFacade({ isCreating: true, position: undefined })

    renderPage()

    expect(screen.getByText('form')).toBeInTheDocument()
  })
})
