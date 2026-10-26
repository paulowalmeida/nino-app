import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { UnitsSetup } from './UnitsSetup'

vi.mock('../UnitsStoreForm/UnitsStoreForm', () => ({
  UnitsStoreForm: ({
    onChange,
  }: {
    onChange: (values: { customName?: string }) => void
  }) => (
    <>
      <button onClick={() => onChange({ customName: 'Café da Vila' })}>
        Create store
      </button>
      <button onClick={() => onChange({})}>Clear store name</button>
    </>
  ),
}))
vi.mock('@shared/components/StorePreview/StorePreview', () => ({
  StorePreview: ({ name }: { name: string }) => <div>Preview {name}</div>,
}))

describe(UnitsSetup.name, () => {
  it('updates the preview from the form name', async () => {
    render(<UnitsSetup />)
    await userEvent.click(screen.getByRole('button', { name: 'Create store' }))
    expect(screen.getByText('Preview Café da Vila')).toBeInTheDocument()
    await userEvent.click(
      screen.getByRole('button', { name: 'Clear store name' })
    )
    expect(screen.getByText('Preview')).toBeInTheDocument()
  })
})
