import type { ReactNode } from 'react'

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { SettingsUnitSection } from './SettingsUnitSection'
vi.mock('react-router', () => ({
  Link: ({ children }: { children: ReactNode }) => <a>{children}</a>,
}))
vi.mock('../../facades/useSettingsFacade/useSettingsFacade', () => ({
  useSettingsFacade: () => ({
    tenant: { tenantId: 'tenant-1' },
    units: {
      groups: [],
      detail: { data: undefined },
      limit: { limit: 3, planName: 'Pro', isFull: false, isPending: false },
      remove: { mutate: vi.fn(), isPending: false },
    },
  }),
}))
vi.mock('./UnitRow/UnitRow', () => ({ UnitRow: () => <li>unit row</li> }))
vi.mock('./RemoveUnitModal/RemoveUnitModal', () => ({
  RemoveUnitModal: () => <div>remove modal</div>,
}))
describe(SettingsUnitSection.name, () => {
  it('renders unit settings', () => {
    render(<SettingsUnitSection />)
    expect(screen.getByText('Lojas da empresa')).toBeInTheDocument()
  })
})
