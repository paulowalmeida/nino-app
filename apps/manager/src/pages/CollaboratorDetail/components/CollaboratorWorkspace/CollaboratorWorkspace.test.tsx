import { MemoryRouter, Route, Routes } from 'react-router'

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useCollaboratorDetailFacade } from '@pages/CollaboratorDetail/facades/useCollaboratorDetailFacade/useCollaboratorDetailFacade'

import { CollaboratorWorkspace } from './CollaboratorWorkspace'

vi.mock(
  '@pages/CollaboratorDetail/facades/useCollaboratorDetailFacade/useCollaboratorDetailFacade'
)
vi.mock('@nino/ds/components/Tabs', () => ({
  Tabs: ({ tabs }: { tabs: { label: string; content: React.ReactNode }[] }) => (
    <div>
      {tabs.map((tab) => (
        <div key={tab.label}>
          <span>{tab.label}</span>
          {tab.content}
        </div>
      ))}
    </div>
  ),
}))
vi.mock('@nino/ds/components/Dialog', () => ({
  Dialog: ({
    onOpenChange,
    onConfirm,
    onCancel,
  }: {
    onOpenChange: (open: boolean) => void
    onConfirm: () => void
    onCancel: () => void
  }) => (
    <div>
      <button onClick={() => onOpenChange(true)}>dialog-open</button>
      <button onClick={() => onOpenChange(false)}>dialog-close</button>
      <button onClick={onConfirm}>dialog-confirm</button>
      <button onClick={onCancel}>dialog-cancel</button>
    </div>
  ),
}))
vi.mock('@shared/components/EditEmailModal/EditEmailModal', () => ({
  EditEmailModal: ({
    onOpenChange,
  }: {
    onOpenChange: (open: boolean) => void
  }) => (
    <div>
      <button onClick={() => onOpenChange(true)}>email-open</button>
      <button onClick={() => onOpenChange(false)}>email-close</button>
    </div>
  ),
}))
vi.mock(
  '@pages/CollaboratorDetail/components/CollaboratorWorkspace/CollaboratorActivity/CollaboratorActivity',
  () => ({ CollaboratorActivity: () => <div>activity</div> })
)
vi.mock(
  '@pages/CollaboratorDetail/components/CollaboratorWorkspace/CollaboratorAccess/CollaboratorAccess',
  () => ({
    CollaboratorAccess: ({
      onOpenEmailModal,
      onOpenRemovalConfirm,
    }: {
      onOpenEmailModal: () => void
      onOpenRemovalConfirm: () => void
    }) => (
      <div>
        <button onClick={onOpenEmailModal}>open-email-access</button>
        <button onClick={onOpenRemovalConfirm}>open-removal-access</button>
      </div>
    ),
  })
)

const member = {
  user: {
    id: 'user-1',
    name: 'Ana Souza',
    credentials: [{ email: 'ana@example.com' }],
    isActive: true,
  },
  activity: [],
}
const renderWorkspace = () =>
  render(
    <MemoryRouter initialEntries={['/colaboradores/user-1']}>
      <Routes>
        <Route
          path="/colaboradores/:userId"
          element={<CollaboratorWorkspace />}
        />
      </Routes>
    </MemoryRouter>
  )

describe(CollaboratorWorkspace.name, () => {
  it('composes activity and access tabs for the loaded collaborator', () => {
    vi.mocked(useCollaboratorDetailFacade).mockReturnValue({
      member,
      isRemoving: false,
      isChangingRole: false,
      saveEmail: vi.fn(),
      roleLockHint: undefined,
      emailLockHint: undefined,
      changeRole: vi.fn(),
      removalLockHint: undefined,
      confirmRemoval: vi.fn(),
    } as never)
    renderWorkspace()
    expect(screen.getByText('Atividade · 0')).toBeInTheDocument()
    expect(screen.getByText('Acesso')).toBeInTheDocument()
    screen.getByRole('button', { name: 'open-email-access' }).click()
    screen.getByRole('button', { name: 'open-removal-access' }).click()
    screen.getByRole('button', { name: 'email-open' }).click()
    screen.getByRole('button', { name: 'email-close' }).click()
    screen.getByRole('button', { name: 'dialog-open' }).click()
    screen.getByRole('button', { name: 'dialog-close' }).click()
    screen.getByRole('button', { name: 'dialog-confirm' }).click()
    screen.getByRole('button', { name: 'dialog-cancel' }).click()
  })

  it('renders nothing when the facade has no member', () => {
    vi.mocked(useCollaboratorDetailFacade).mockReturnValue({
      member: undefined,
    } as never)
    const { container } = renderWorkspace()
    expect(container).toBeEmptyDOMElement()
  })

  it('uses empty route scope when unit and route params are unavailable', () => {
    vi.mocked(useCollaboratorDetailFacade).mockReturnValue({
      member: undefined,
    } as never)
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<CollaboratorWorkspace />} />
        </Routes>
      </MemoryRouter>
    )
    expect(useCollaboratorDetailFacade).toHaveBeenLastCalledWith()
  })
})
