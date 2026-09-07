import type { ReactNode } from 'react'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { SettingsUnitSection } from './SettingsUnitSection'
import { companyUnitsMock } from './SettingsUnitSection.mock'

const removeUnit = vi.fn()

const domain = {
  groups: [] as typeof companyUnitsMock,
  limit: {
    limit: 3 as number | null,
    planName: 'Pro',
    isFull: false,
    isPending: false,
  },
}

vi.mock('react-router', () => ({
  Link: ({ children, to }: { children: ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}))
vi.mock('@pages/Units/facades/useUnitsFacade/useUnitsFacade', () => ({
  useUnitsFacade: () => ({
    tenant: { tenantId: 'tenant-1' },
    units: {
      groups: domain.groups,
      detail: { data: { isMain: true } },
      limit: domain.limit,
      remove: { mutate: removeUnit, isPending: false },
    },
  }),
}))
vi.mock('./UnitRow/UnitRow', () => ({
  UnitRow: ({
    name,
    to,
    onRemove,
  }: {
    name: string
    to: string
    onRemove: () => void
  }) => (
    <li>
      <a href={to}>{name}</a>
      <button onClick={onRemove}>fechar {name}</button>
    </li>
  ),
}))
vi.mock('./RemoveUnitModal/RemoveUnitModal', () => ({
  RemoveUnitModal: ({
    open,
    unitName,
    onConfirm,
  }: {
    open: boolean
    unitName: string
    onConfirm: () => void
  }) =>
    open ? (
      <div>
        <span>fechar mesmo {unitName}</span>
        <button onClick={onConfirm}>confirmar</button>
      </div>
    ) : null,
}))

describe(SettingsUnitSection.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
    domain.groups = []
    domain.limit = {
      limit: 3,
      planName: 'Pro',
      isFull: false,
      isPending: false,
    }
  })

  it('renders unit settings', () => {
    render(<SettingsUnitSection />)

    expect(screen.getByText('Lojas da empresa')).toBeInTheDocument()
  })

  it('says the company has no store yet', () => {
    render(<SettingsUnitSection />)

    expect(screen.getByText('Nenhuma loja cadastrada.')).toBeInTheDocument()
  })

  it('counts the stores against the plan', () => {
    domain.groups = companyUnitsMock

    render(<SettingsUnitSection />)

    expect(screen.getByText('2 de 3 inclusas no plano Pro.')).toBeInTheDocument()
  })

  it('says there is no ceiling when the plan has none', () => {
    domain.groups = companyUnitsMock
    domain.limit = {
      limit: null,
      planName: 'Pro',
      isFull: false,
      isPending: false,
    }

    render(<SettingsUnitSection />)

    expect(
      screen.getByText('2 em operação, sem limite no seu plano.')
    ).toBeInTheDocument()
  })

  it('keeps the current unit on a relative path and the others on their own', () => {
    domain.groups = companyUnitsMock

    render(<SettingsUnitSection />)

    expect(screen.getByRole('link', { name: 'Loja principal' })).toHaveAttribute(
      'href',
      '/tenant-1/unidade/informacoes'
    )
    expect(screen.getByRole('link', { name: 'Loja Centro' })).toHaveAttribute(
      'href',
      '/tenant-2/unidade/informacoes'
    )
  })

  it('trades the new store button for the plan ceiling once it is full', () => {
    domain.groups = companyUnitsMock
    domain.limit = { limit: 2, planName: 'Pro', isFull: true, isPending: false }

    render(<SettingsUnitSection />)

    expect(
      screen.queryByRole('link', { name: 'Abrir unidade' })
    ).not.toBeInTheDocument()
    expect(screen.getByText(/O plano Pro cobre/)).toBeInTheDocument()
  })

  it('closes the store the person confirmed', async () => {
    domain.groups = companyUnitsMock

    render(<SettingsUnitSection />)

    await userEvent.click(
      screen.getByRole('button', { name: 'fechar Loja Centro' })
    )
    await userEvent.click(screen.getByRole('button', { name: 'confirmar' }))

    expect(removeUnit).toHaveBeenCalledWith(
      'tenant-2',
      expect.objectContaining({ onSuccess: expect.any(Function) })
    )
  })

  it('shows the skeleton until the plan is known', () => {
    domain.limit = {
      limit: null,
      planName: '',
      isFull: false,
      isPending: true,
    }

    render(<SettingsUnitSection />)

    expect(screen.queryByText('Lojas da empresa')).not.toBeInTheDocument()
  })
})
