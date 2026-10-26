import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useTableTabDetailFacade } from '@pages/TableTabDetail/facades/useTableTabDetailFacade/useTableTabDetailFacade'

import { TableTabDetail } from './TableTabDetail'
import { tableTabDetailPageMock } from './TableTabDetail.mock'

vi.mock(
  '@pages/TableTabDetail/facades/useTableTabDetailFacade/useTableTabDetailFacade'
)
vi.mock('@pages/TableTabDetail/components/TabDetailHero/TabDetailHero', () => ({
  TabDetailHero: () => <div>cabeçalho da comanda</div>,
}))
vi.mock('@pages/TableTabDetail/components/TabReceipt/TabReceipt', () => ({
  TabReceipt: () => <div>consumo da comanda</div>,
}))
vi.mock('@pages/TableTabDetail/components/TabActions/TabActions', () => ({
  TabActions: () => <div>ações da comanda</div>,
}))

const renderPage = (facade: Record<string, unknown>) => {
  vi.mocked(useTableTabDetailFacade).mockReturnValue({
    tab: tableTabDetailPageMock.tab,
    isPending: false,
    isError: false,
    ...facade,
  } as unknown as ReturnType<typeof useTableTabDetailFacade>)

  return render(
    <MemoryRouter>
      <TableTabDetail />
    </MemoryRouter>
  )
}

describe('TableTabDetail', () => {
  it('composes the hero, the receipt and the actions of the tab', () => {
    renderPage({})

    expect(screen.getByText('cabeçalho da comanda')).toBeInTheDocument()
    expect(screen.getByText('consumo da comanda')).toBeInTheDocument()
    expect(screen.getByText('ações da comanda')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /Voltar para comandas/ })
    ).toBeInTheDocument()
  })

  it('announces the loading state', () => {
    renderPage({ tab: undefined, isPending: true })

    expect(
      screen.getByRole('status', {
        name: tableTabDetailPageMock.loadingMessage,
      })
    ).toBeInTheDocument()
    expect(screen.queryByText('consumo da comanda')).not.toBeInTheDocument()
  })

  it('asks to try again when the tab fails to load', () => {
    renderPage({ tab: undefined, isError: true })

    expect(screen.getByRole('alert')).toHaveTextContent(
      tableTabDetailPageMock.errorMessage
    )
    expect(screen.queryByText('consumo da comanda')).not.toBeInTheDocument()
  })

  it('says when the tab does not exist in this store', () => {
    renderPage({ tab: undefined })

    expect(
      screen.getByText(tableTabDetailPageMock.notFoundMessage)
    ).toBeInTheDocument()
    expect(screen.queryByText('consumo da comanda')).not.toBeInTheDocument()
  })
})
