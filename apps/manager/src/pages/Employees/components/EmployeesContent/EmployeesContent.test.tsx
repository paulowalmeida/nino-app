import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useEmployeesFacade } from '@pages/Employees/facades/useEmployeesFacade/useEmployeesFacade'

import { EmployeesContent } from './EmployeesContent'

vi.mock('@pages/Employees/facades/useEmployeesFacade/useEmployeesFacade')
vi.mock('./InviteForm/InviteForm', () => ({ InviteForm: () => <div>invite</div> }))
vi.mock('./TeamRoster/TeamRoster', () => ({ TeamRoster: ({ title }: { title: string }) => <div>{title}</div> }))
vi.mock('@shared/components/EditEmailModal/EditEmailModal', () => ({ EditEmailModal: () => null }))

describe(EmployeesContent.name, () => {
  it('composes the invitation and both team rosters', () => {
    vi.mocked(useEmployeesFacade).mockReturnValue({
      unit: { role: 'UNIT_OWNER' },
      staffEntries: [],
      courierEntries: [],
      isStaffPending: false,
      isCourierPending: false,
      isRemoving: false,
      isChangingRole: false,
    } as never)
    render(
      <MemoryRouter>
        <EmployeesContent />
      </MemoryRouter>
    )
    expect(screen.getByText('invite')).toBeInTheDocument()
    expect(screen.getByText('No painel')).toBeInTheDocument()
    expect(screen.getByText('Na rua')).toBeInTheDocument()
  })

  it('opens the requested team tab from the URL', () => {
    vi.mocked(useEmployeesFacade).mockReturnValue({
      unit: { role: 'UNIT_OWNER' },
      staffEntries: [],
      courierEntries: [],
      isStaffPending: false,
      isCourierPending: false,
      isRemoving: false,
      isChangingRole: false,
    } as never)

    render(
      <MemoryRouter initialEntries={['/colaboradores?tab=couriers']}>
        <EmployeesContent />
      </MemoryRouter>
    )

    expect(screen.getByRole('tab', { name: 'Na rua · 0' })).toHaveAttribute(
      'aria-selected',
      'true'
    )
  })
})
