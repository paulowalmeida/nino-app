import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { TableTabs } from './TableTabs'
import { tableTabsPageMock } from './TableTabs.mock'

vi.mock(
  '@pages/TableTabs/components/TableTabsHeader/TableTabsHeader',
  () => ({ TableTabsHeader: () => <div>cabeçalho das comandas</div> })
)
vi.mock(
  '@pages/TableTabs/components/TableTabsBoard/TableTabsBoard',
  () => ({ TableTabsBoard: () => <div>quadro das comandas</div> })
)

describe('TableTabs', () => {
  it('composes the header above the tab board', () => {
    render(<TableTabs />)

    expect(screen.getByText(tableTabsPageMock.header)).toBeInTheDocument()
    expect(screen.getByText(tableTabsPageMock.board)).toBeInTheDocument()
  })
})
