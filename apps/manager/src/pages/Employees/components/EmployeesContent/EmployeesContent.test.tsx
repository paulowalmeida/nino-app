import { MemoryRouter } from 'react-router'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useEmployeesFacade } from '@pages/Employees/facades/useEmployeesFacade/useEmployeesFacade'

import { EmployeesContent } from './EmployeesContent'
import { employeesContentFacadeMock } from './EmployeesContent.mock'

vi.mock('@pages/Employees/facades/useEmployeesFacade/useEmployeesFacade')
vi.mock('./InviteForm/InviteForm', () => ({
  InviteForm: () => <div>invite</div>,
}))
vi.mock('./TeamRoster/TeamRoster', () => ({
  TeamRoster: (props: {
    title: string
    removingId?: string
    changingPositionId?: string
    onRemove: (id: string) => void
    onEdit?: (id: string) => void
    onSetActivity?: (id: string) => void
    onChangePosition?: (id: string, positionId: string) => void
  }) => (
    <section aria-label={props.title}>
      <span>{props.title}</span>
      <span>{`removing:${props.removingId ?? 'none'}`}</span>
      <span>{`changing:${props.changingPositionId ?? 'none'}`}</span>
      <button onClick={() => props.onRemove('user-2')}>
        {`remove ${props.title}`}
      </button>
      {props.onEdit && (
        <button onClick={() => props.onEdit?.('user-2')}>edit staff</button>
      )}
      {props.onSetActivity && (
        <button onClick={() => props.onSetActivity?.('user-2')}>
          toggle activity
        </button>
      )}
      {props.onChangePosition && (
        <button onClick={() => props.onChangePosition?.('user-2', 'p-1')}>
          promote
        </button>
      )}
    </section>
  ),
}))
vi.mock('./EditStaffModal/EditStaffModal', () => ({
  EditStaffModal: (props: {
    open: boolean
    staff: { email: string | null } | null
    onOpenChange: (open: boolean) => void
    onSave: (values: { name: string; email: string }) => void
  }) => (
    <div>
      <span>{`modal:${props.open ? 'open' : 'closed'}`}</span>
      <button
        onClick={() =>
          props.onSave({ name: 'Novo nome', email: 'novo@example.com' })
        }
      >
        {`save ${props.staff?.email ?? 'null'}`}
      </button>
      <button onClick={() => props.onOpenChange(false)}>close modal</button>
      <button onClick={() => props.onOpenChange(true)}>reopen modal</button>
    </div>
  ),
}))

const facade = {
  ...employeesContentFacadeMock,
  invite: vi.fn(),
  removeMember: vi.fn(),
  updateStaffEmail: vi.fn(),
  updateStaffProfile: vi.fn(),
  setStaffActivity: vi.fn(),
  changePosition: vi.fn(),
}

const renderContent = (entry = '/colaboradores') =>
  render(
    <MemoryRouter initialEntries={[entry]}>
      <EmployeesContent />
    </MemoryRouter>
  )

describe(EmployeesContent.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useEmployeesFacade).mockReturnValue(facade as never)
  })

  it('composes the invitation and both team rosters', () => {
    renderContent()

    expect(screen.getByText('invite')).toBeInTheDocument()
    expect(screen.getByText('Ativos')).toBeInTheDocument()
    expect(screen.getAllByText('Na rua').length).toBeGreaterThan(0)
  })

  it('opens the requested team tab from the URL and switches back', async () => {
    renderContent('/colaboradores?tab=couriers')

    expect(screen.getByRole('tab', { name: 'Na rua · 0' })).toHaveAttribute(
      'aria-selected',
      'true'
    )

    await userEvent.click(screen.getByRole('tab', { name: 'Ativos · 1' }))
    expect(screen.getByRole('tab', { name: 'Ativos · 1' })).toHaveAttribute(
      'aria-selected',
      'true'
    )
  })

  it('switches to the couriers tab', async () => {
    renderContent()

    await userEvent.click(screen.getByRole('tab', { name: 'Na rua · 0' }))

    expect(screen.getByRole('tab', { name: 'Na rua · 0' })).toHaveAttribute(
      'aria-selected',
      'true'
    )
  })

  it('removes a staff member and promotes through the facade for the owner', async () => {
    renderContent()

    await userEvent.click(screen.getByRole('button', { name: 'remove Ativos' }))
    await userEvent.click(screen.getByRole('button', { name: 'promote' }))

    expect(facade.removeMember).toHaveBeenCalledWith({
      id: 'user-2',
      kind: 'STAFF',
    })
    expect(facade.changePosition).toHaveBeenCalledWith({
      userId: 'user-2',
      positionId: 'p-1',
    })
  })

  it('removes a courier through the facade', async () => {
    renderContent('/colaboradores?tab=couriers')

    await userEvent.click(screen.getByRole('button', { name: 'remove Na rua' }))

    expect(facade.removeMember).toHaveBeenCalledWith({
      id: 'user-2',
      kind: 'COURIER',
    })
  })

  it('edits the name and e-mail of the selected member through the modal', async () => {
    renderContent()

    await userEvent.click(screen.getByRole('button', { name: 'edit staff' }))
    await userEvent.click(
      screen.getByRole('button', { name: 'save caio@example.com' })
    )

    expect(facade.updateStaffProfile).toHaveBeenCalledWith({
      userId: 'user-2',
      name: 'Novo nome',
      email: 'novo@example.com',
    })
  })

  it('hides cargo promotion from anyone but the owner', () => {
    vi.mocked(useEmployeesFacade).mockReturnValue({
      ...facade,
      unit: { role: 'MANAGER' },
    } as never)

    renderContent()

    expect(
      screen.queryByRole('button', { name: 'promote' })
    ).not.toBeInTheDocument()
  })

  it('tells the roster which rows are being removed or changed', () => {
    vi.mocked(useEmployeesFacade).mockReturnValue({
      ...facade,
      isRemoving: true,
      removingVariables: { id: 'user-2', kind: 'STAFF' },
      isChangingPosition: true,
      positionVariables: { userId: 'user-2', positionId: 'p-1' },
    } as never)

    renderContent()

    expect(screen.getAllByText('removing:user-2')).not.toHaveLength(0)
    expect(screen.getByText('changing:user-2')).toBeInTheDocument()
  })

  it('closes the e-mail modal and keeps it open on a reopen request', async () => {
    renderContent()

    await userEvent.click(screen.getByRole('button', { name: 'edit staff' }))
    expect(screen.getByText('modal:open')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'reopen modal' }))
    expect(screen.getByText('modal:open')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'close modal' }))
    expect(screen.getByText('modal:closed')).toBeInTheDocument()
  })

  it('saves with an empty user id when no member is being edited', async () => {
    renderContent()

    await userEvent.click(screen.getByRole('button', { name: 'save null' }))

    expect(facade.updateStaffProfile).toHaveBeenCalledWith({
      userId: '',
      name: 'Novo nome',
      email: 'novo@example.com',
    })
  })

  it('tells the couriers roster which courier is being removed', () => {
    vi.mocked(useEmployeesFacade).mockReturnValue({
      ...facade,
      isRemoving: true,
      removingVariables: { id: 'courier-1', kind: 'COURIER' },
    } as never)

    renderContent('/colaboradores?tab=couriers')

    expect(screen.getByText('removing:courier-1')).toBeInTheDocument()
  })
})
