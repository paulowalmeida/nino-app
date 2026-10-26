import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useEmployeesFacade } from '@pages/Employees/facades/useEmployeesFacade/useEmployeesFacade'

import { EmployeesHeader } from './EmployeesHeader'
import { employeesHeaderSeatsMock } from './EmployeesHeader.mock'

vi.mock('@pages/Employees/facades/useEmployeesFacade/useEmployeesFacade')

const renderHeader = (entry = '/colaboradores') =>
  render(
    <MemoryRouter initialEntries={[entry]}>
      <EmployeesHeader />
    </MemoryRouter>
  )

describe(EmployeesHeader.name, () => {
  beforeEach(() => {
    vi.mocked(useEmployeesFacade).mockReturnValue({
      invite: vi.fn(),
      inviteSeats: employeesHeaderSeatsMock,
    } as unknown as ReturnType<typeof useEmployeesFacade>)
  })

  it('presents the team page heading and explanation', () => {
    renderHeader()

    expect(
      screen.getByRole('heading', { name: 'Colaboradores' })
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Cada pessoa entra com a própria conta/)
    ).toBeInTheDocument()
  })

  it('opens the invitation from the header button', async () => {
    renderHeader()

    expect(
      screen.queryByPlaceholderText('nome@exemplo.com')
    ).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Convidar' }))

    expect(
      await screen.findByPlaceholderText('nome@exemplo.com')
    ).toBeInTheDocument()
  })

  it('opens the invitation straight from a command palette link', async () => {
    renderHeader('/colaboradores?acao=convidar')

    expect(
      await screen.findByPlaceholderText('nome@exemplo.com')
    ).toBeInTheDocument()
  })
})
