import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { StoreSelection } from './StoreSelection'
import { storeSelectionPageMock } from './StoreSelection.mock'

vi.mock(
  '@pages/StoreSelection/components/StoreSelectionHeader/StoreSelectionHeader',
  () => ({ StoreSelectionHeader: () => <div>cabeçalho de restaurantes</div> })
)
vi.mock('@pages/StoreSelection/components/CompanyPickList/CompanyPickList', () => ({
  CompanyPickList: () => <div>lista de restaurantes</div>,
}))

describe('StoreSelection', () => {
  it('composes the header and the list of restaurants', () => {
    render(<StoreSelection />)

    expect(
      screen.getByText(storeSelectionPageMock.headerLabel)
    ).toBeInTheDocument()
    expect(
      screen.getByText(storeSelectionPageMock.listLabel)
    ).toBeInTheDocument()
  })
})
