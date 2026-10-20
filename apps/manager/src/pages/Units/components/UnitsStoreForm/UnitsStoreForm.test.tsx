import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { UnitsStoreForm } from './UnitsStoreForm'

vi.mock('@pages/Units/facades/useUnitsFacade/useUnitsFacade', () => ({
  useUnitsFacade: () => ({ typeOptions: [], submitStore: vi.fn() }),
}))
vi.mock('@shared/components/StoreForm/StoreForm', () => ({
  StoreForm: () => <div>store form</div>,
}))

describe(UnitsStoreForm.name, () => {
  it('connects the domain facade to the store form', () => {
    render(<UnitsStoreForm onChange={() => undefined} />)
    expect(screen.getByText('store form')).toBeInTheDocument()
  })
})
