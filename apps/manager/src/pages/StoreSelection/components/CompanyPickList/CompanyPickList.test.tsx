import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useStoreSelectionFacade } from '@pages/StoreSelection/facades/useStoreSelectionFacade/useStoreSelectionFacade'

import { CompanyPickList } from './CompanyPickList'
import { companyPickListMock } from './CompanyPickList.mock'

vi.mock(
  '@pages/StoreSelection/facades/useStoreSelectionFacade/useStoreSelectionFacade'
)

const selectCompany = vi.fn()

describe('CompanyPickList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useStoreSelectionFacade).mockReturnValue({
      companies: companyPickListMock,
      selectCompany,
    })
  })

  it('lists every restaurant the owner belongs to', () => {
    render(<CompanyPickList />)

    expect(
      screen.getByText(companyPickListMock[0].companyName)
    ).toBeInTheDocument()
    expect(
      screen.getByText(companyPickListMock[1].companyName)
    ).toBeInTheDocument()
  })

  it('opens the chosen company', async () => {
    render(<CompanyPickList />)

    await userEvent.click(screen.getByText(companyPickListMock[1].companyName))

    expect(selectCompany).toHaveBeenCalledWith(companyPickListMock[1].units)
  })

  it('shows an empty state for an account with no linked company', () => {
    vi.mocked(useStoreSelectionFacade).mockReturnValue({
      companies: [],
      selectCompany,
    })

    render(<CompanyPickList />)

    expect(screen.getByText('Nada por aqui')).toBeInTheDocument()
    expect(
      screen.queryByText(companyPickListMock[0].companyName)
    ).not.toBeInTheDocument()
  })
})
